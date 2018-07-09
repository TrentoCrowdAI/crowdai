import React from 'react'
import * as d3 from 'd3'
import {connect} from 'react-redux'
import { Button } from 'semantic-ui-react'

class GroupedChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        order: this.props.x
    }
    this.buildGraph = this.buildGraph.bind(this);
    this.dataWrapper = this.dataWrapper.bind(this);
  }

  dataWrapper() {
    if(this.props.data.length===0) {
      var svg = d3.select("."+this.props.selector)
      var margin = {top: 30, right: 30, bottom: 30, left: 30};
      var g = svg.append("g")

      g.append("text")
        .text("No data retrieved, try to Reload or check selected Job")
        .attr('font-weight', 'bold')
        .attr('font-size', '15px')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    } else {
      this.buildGraph()
    }
  }

  buildGraph() {
    var svg = d3.select("."+this.props.selector);
    
    var zoom = d3.zoom()
      .on("zoom", zoomFunction)

    var margin = {top: 30, right: 30, bottom: 30, left: 30};
    var width = +svg.attr("width") - margin.left - margin.right;
    var height = +svg.attr("height") - margin.top - margin.bottom;
    var g = svg.append("g")
      .attr("class","innerspace")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .call(zoom)

    var x = this.props.x
    var y = this.props.y
    var z = this.props.z
    var w = this.props.w
    var param = this.props.param
    
    var data = this.props.data.sort( (a,b) => 
      a[this.state.order]<b[this.state.order] ? 1 : a[this.state.order]>b[this.state.order] ? -1 : 0 )
    
    //in this case we need 2 x scales, one for the element, and one for the 3 bars to place
    var x0scale = d3.scaleBand()
      .range([0,width])
      .paddingInner(0.1)

    var x1scale = d3.scaleBand()
      .padding(0.05)

    var yscale = d3.scaleLinear()
      .range([height,0])
    
    var colorscale = d3.scaleOrdinal()
      .range(['#2185d0','orange','lightgreen'])

    //define the 3 metrics to represent
    var keys = [y,z,w]

    x0scale.domain( data.map(d => (d[x[0]]+ (x[1]!=='null' ? (', '+d[x[1]]) : '' )) ))
    x1scale.domain(keys).range([0, x0scale.bandwidth()])
    yscale.domain([
      -1, 1
      //d3.max(data, d => Math.max(d[w],d[y],d[z]))
    ])

    var tooltip = d3.select('body')
        .append('div')
        .style('width', '300px')
        .style('height',(x[1]==='null'? '90' : '150') +'px')
        .style('background','#A7DEF2')
        .style('opacity','0.90')
        .style('position','absolute')
        .style('visibility','hidden')
        .style('padding','5px')
        .style('box-shadow','0px 0px 6px #7861A5')

    tooltip.append('div')

    //append a canvas for each data element
    var bars = g.append('g')
      .selectAll('g')
      .data(data)
      .enter().append('g')
        .attr('transform', d => 'translate('+x0scale(d[x[0]]+ (x[1]!=='null' ? (', '+d[x[1]] ) : '') )+',0)')
        .on('mousemove', d => {
          tooltip.style('visibility', 'visible')
            .style('top',(d3.event.pageY-50)+'px')
            .style('left',(d3.event.pageX-310)+'px')
          tooltip.select('div')
            .html(x[0]+': <b>'+d[x[0]]+'</b>,'+
              (x[1]!=='null' ? ('<br />'+x[1]+': <b>'+d[x[1]]+'</b>,') : '')+
              '<br />'+y+' => <b>'+d[y].toFixed(2)+'</b>,'+
              '<br />'+z+' => <b>'+d[z].toFixed(2)+'</b>,'+
              '<br />'+w+' => <b>'+d[w].toFixed(2)+'</b>')
        })
        .on('mouseout', d => {
          tooltip.style('visibility', 'hidden')
        })
    
    //build one bar per each metric for each element
    var rects = bars.selectAll('rect')
      .data(d => keys.map(k => { return {'key': k, 'value': (d[k]>1 ? 1 : d[k]) } }))
      .enter().append('rect')
        .attr('x', d => x1scale(d.key))
        .attr('y', d => 
              (d.value>=0) ? yscale(d.value) 
            : (d.value<0 ) ? yscale(0)
            : yscale(d.value) )
        .attr('width', d => x1scale.bandwidth())
        .attr('height', d => 
              (d.value>=0 ) ? (height/2)-yscale(d.value) 
            : (d.value<0 ) ? (height/2*(-1))+yscale(d.value)
            : (height)-yscale(d.value) )
        .attr('fill', d => colorscale(d.key))

    var gx = g.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,'+yscale(0)+')')
      .call(d3
        .axisBottom(x0scale)
        .tickFormat("")
      )

    gx.selectAll("text")
          .attr("text-anchor","end")
          .attr("dx","-.8em")
          .attr("dy","-.5em")
          .attr("transform","rotate(-65)")

    g.append('g')
        .attr('class','y axis')
        .call(d3.axisLeft(yscale).ticks(null,'s'))
      .append('text')
        .attr('x',2)
        .attr('y',yscale(yscale.ticks().pop())+0.5 )
        .attr('dy','0.32em')
        .attr('fill','#000')
        .attr('font-weight','bold')
        .attr('text-anchor','start')
        .text('metrics')

    function zoomFunction() {
      //create both new scales based on zoom event
      x0scale.range([0,width].map(d => d3.event.transform.applyX(d)))
      x1scale.range([0, x0scale.bandwidth()])

      gx.call(d3
        .axisBottom(x0scale)
        .tickFormat("")
      )

      //rescale all components that need to be zoomed
      bars.attr('transform', d => 'translate('+x0scale(d[x[0]]+ (x[1]!=='null' ? (', '+d[x[1]]) : '') )+',0)')

      rects.attr('x', d => x1scale(d.key))
      rects.attr('width', d => x1scale.bandwidth())
    }

  }

  componentDidMount() {
    this.dataWrapper();
  }

  componentDidUpdate() {
    d3.select("."+this.props.selector).selectAll("g").remove();
    this.dataWrapper();
  }

  render() {
    var x = this.props.x
    var y = this.props.y
    var z = this.props.z
    var w = this.props.w

    //buttons to order data by each parameter
    return(
      <div>
        <br />
        <svg className={this.props.selector} width='900' height='400'> </svg>
        <br />
        { this.props.data.length ? 
        <React.Fragment>
        <Button
          onClick={(event) => this.setState({ order: this.props.y }) }
          style={{marginBottom: '5px'}}
        >Sort {this.props.y}</Button>

        <Button
          onClick={(event) => this.setState({ order: this.props.z }) }
          style={{marginBottom: '5px'}}
        >Sort {this.props.z}</Button>

        <Button
          onClick={(event) => this.setState({ order: this.props.w }) }
          style={{marginBottom: '5px'}}
        >Sort {this.props.w}</Button>
        </React.Fragment> : " "
        }
        <br />
        <strong style={{color: '#2185d0'}}>> {y.toUpperCase()}</strong>
        <br />
        <strong style={{color: 'orange'}}>> {z.toUpperCase()}</strong>
        <br />
        <strong style={{color: 'lightgreen'}}>> {w.toUpperCase()}</strong>
      </div>
    )
  }
}

GroupedChart.propTypes = {

}

const mapStateToProps = state => ({

})

const mapDispatchToProps = dispatch => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(GroupedChart);

