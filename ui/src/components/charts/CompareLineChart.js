import React from 'react'
import PropTypes from 'prop-types'
import * as d3 from 'd3'
import {connect} from 'react-redux'
import { Button } from 'semantic-ui-react'

class CompareLineChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      order: this.props.y
    }
    this.buildGraph = this.buildGraph.bind(this);
    this.dataWrapper = this.dataWrapper.bind(this);
  }

  dataWrapper() {
    if(this.props.data.length===0) {
      var svg = d3.select("."+this.props.selector)
      var margin = {top: 10, right: 30, bottom: 30, left: 30};
      var g = svg.append("g")

      g.append("text")
        .text("Choose a Metric")
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
    
    var data = this.props.data.sort( (a,b) => a[this.state.order]<b[this.state.order] ? 1 : a[this.state.order]>b[this.state.order] ? -1 : 0 )
    
    var xscale = d3.scaleBand()
        .domain( data.map(d => d[x[0]]+", "+d[x[1]]) )
        .range([0,width])
    var xAxis = d3.axisBottom(xscale)
      .ticks(d=> d[x[0]]+", "+d[x[1]])

    var yscale = d3.scaleLinear()
        .domain([ 
          d3.min(data, d => Math.min(d[w],d[y],d[z])), 
          d3.max(data, d => Math.max(d[w],d[y],d[z])) 
        ])
        .range([height, 0])
    var yAxis = d3.axisLeft(yscale);

    var tooltip = d3.select('body')
      .append('div')
      .style('width','300px')
      .style('height','150px')
      .style('background','#A7DEF2')
      .style('opacity','0.90')
      .style('position','absolute')
      .style('visibility','hidden')
      .style('padding','5px')
      .style('box-shadow','0px 0px 6px #7861A5')

    tooltip.append('div')

    var gx = g.append("g")
      .attr("class","x axis")
      .attr("transform","translate(0,"+height+")")
      .call(xAxis)

    gx.selectAll("text")
      .attr("text-anchor","end")
      .attr("dx","-.8em")
      .attr("dy","-.5em")
      .attr("transform","rotate(-65)")

    g.append("g")
       .attr("class","y axis")
       .call(yAxis)

    var line1 = d3.line()
      .x( d => xscale(d[x[0]]+", "+d[x[1]]) )
      .y( d => yscale(d[y]) )
      .curve(d3.curveMonotoneX);

    var line2 = d3.line()
      .x( d => xscale(d[x[0]]+", "+d[x[1]]) )
      .y( d => yscale(d[z]) )
      .curve(d3.curveMonotoneX);

    var line3 = d3.line()
      .x( d => xscale(d[x[0]]+", "+d[x[1]]) )
      .y( d => yscale(d[w]) )
      .curve(d3.curveMonotoneX)

    var path1 = g.append("path")
      .datum(data)
      .attr("class","original")
      .attr("id", "cohen")
      .attr("d", line1)
      .style("stroke", 'steelblue')
      .style("fill","none")
      .style("stroke-width",1)
      
    var path2 = g.append("path")
      .datum(data)
      .attr("class","original")
      .attr("id","m1")
      .attr("d", line2)
      .style("stroke", 'orange')
      .style("fill","none")
      .style("stroke-width",1)

    var path3 = g.append("path")
      .datum(data)
      .attr("class","original")
      .attr("id","po")
      .attr("d", line3)
      .style("stroke", 'lightgreen')
      .style("fill","none")
      .style("stroke-width",1)

    g.append("rect")
      .attr("class","zoom")
      .attr("width", width)
      .attr("height", height)
      .call(zoom)

    var points2 = g.selectAll(".dot2")
      .data(data).enter()
        .append("circle")
        .style("fill", 'orange')
        .attr("class","dot")
        .attr("cx", d => xscale(d[x[0]]+", "+d[x[1]]) )
        .attr("cy", d => yscale(d[z]) )
        .attr("r",2)
        
    var points3 = g.selectAll(".dot3")
      .data(data).enter()
        .append("circle")
        .style("fill", 'lightgreen')
        .attr("class","dot")
        .attr("cx", d => xscale(d[x[0]]+", "+d[x[1]]) )
        .attr("cy", d => yscale(d[w]) )
        .attr("r",2)

    var points1 = g.selectAll(".dot1")
        .data(data).enter()
          .append("circle")
          .style("fill", 'steelblue')
          .attr("class","dot")
          .attr("cx", d => xscale(d[x[0]]+", "+d[x[1]]) )
          .attr("cy", d => yscale(d[y]) )
          .attr("r",2)
          .on("mouseover", d => {
            tooltip.style('visibility', 'visible')
              .style('top',(d3.event.pageY-50)+'px')
              .style('left',(d3.event.pageX-310)+'px')
            tooltip.select('div')
                .html(x[0]+': <b>'+d[x[0]]+'</b>,'+
                  '<br />'+x[1]+': <b>'+d[x[1]]+'</b>,'+
                  '<br />'+y+' => <b>'+d[y].toFixed(2)+'</b>,'+
                  '<br />'+z+' => <b>'+d[z].toFixed(2)+'</b>,'+
                  '<br />'+w+' => <b>'+d[w].toFixed(2)+'</b>')
            })
          .on("mouseout", d => tooltip.style('visibility', 'hidden'))

    function zoomFunction() {
      xscale.range([0,width].map(d => d3.event.transform.applyX(d)))

      gx.call(d3.axisBottom(xscale))

      line1.x(d => xscale(d[x[0]]+", "+d[x[1]]))
      line2.x(d => xscale(d[x[0]]+", "+d[x[1]]))
      line3.x(d => xscale(d[x[0]]+", "+d[x[1]]))

      path1.attr("d",line1)
      path2.attr("d",line2)
      path3.attr("d",line3)

      points1.attr("cx", d => xscale(d[x[0]]+", "+d[x[1]]) )
      points2.attr("cx", d => xscale(d[x[0]]+", "+d[x[1]]) )
      points3.attr("cx", d => xscale(d[x[0]]+", "+d[x[1]]) )

      //to zoom y axis
      /*var new_yscale = d3.event.transform.rescaleY(yscale)
      gy.call(yAxis.scale(d3.event.transform.rescaleY(yscale)))

      line1.y(d => new_yscale(d[y]))
      line2.y(d => new_yscale(d[z]))

      path1.attr("d",line1)
      path2.attr("d",line2)*/
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
    //var j = this.props.j
    return(
      <div>
        <br />
        <svg className={this.props.selector} width="1000" height="500"> </svg>
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
          </React.Fragment> : " " }
        <br />
        <strong style={{color: 'steelblue'}}>> {y.toUpperCase()}</strong>:
        <br />
        {y==="cohen's kappa correlation" ?
          <div>
          Correlation coefficient that represents total agreement between two workers, also taking in acocunt agreement happening by chance.
          <br />= -1, No Agreement at all, worst than random
          <br />= 0, Agreement happening just by chance when workers try to guess answers
          <br />= 1, Perfect Agreement, workers agree an all the answers
          </div>
         : ""}
        <br />
        <strong style={{color: 'orange'}}>> {z.toUpperCase()}</strong>:
        <br />
        {z==="basic agreement" ?
          <div>
          Agreement metric just taking in account observed answers,
          <br/>
          Percentage representing how much the two workers <b>answer THE SAME way</b> to the tasks (both answer Right or both answer Wrong).
          </div>
         : "" }
        <br />
        <strong style={{color: 'lightgreen'}}>> {w.toUpperCase()}</strong>:
        <br />
        {w==="bennett's s" ?
          <div>
          Correlation coefficient computing Expected Agreement for the couple of workers taking in coount the pattern of their answers.
          </div>
         : ""}
      </div>
    )
  }
}

CompareLineChart.propTypes = {

}

const mapStateToProps = state => ({

})

const mapDispatchToProps = dispatch => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(CompareLineChart);

