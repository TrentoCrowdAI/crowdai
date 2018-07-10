import React from 'react'
import * as d3 from 'd3'
import * as d3time from 'd3-timelines'
import {connect} from 'react-redux'
import { Button } from 'semantic-ui-react'

class TimeLineChart extends React.Component {
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
      var margin = {top: 60, right: 30, bottom: 70, left: 40};
      var g = svg.append("g")

      g.append("text")
        .text("Choose a Worker")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    } else {
      this.buildGraph()
    }
  }

  buildGraph() {
    var svg = d3.select("."+this.props.selector)

    var zoom = d3.zoom()
      .on("zoom", zoomFunction)

    var margin = {top: 60, right: 30, bottom: 70, left: 40};
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

    //color scale to fill different bars basing on answer cateogries
    var color = this.props.color!=undefined ? 
      d3.scaleOrdinal(this.props.color) : 
      d3.scaleOrdinal(['lightgreen','orange','#2185d0'])

    //filtering data basing on both parameters
    var data = this.props.data
			.filter(d => param[0]==='all' && param[1]==='all' ? true 
				: param[0]!=='all' && param[1]==='all' ? d[x]===param[0]
				: param[0]==='all' && param[1]!=='all' ? d[z]===param[1]
				: param[0]!=='all' && param[1]!=='all' ? d[x]===param[0] && d[z]===param[1] 
        : false )
    
    var categories = Array.from(new Set(data.map(d => d[w])))

    var xscale = d3.scaleTime()
      .domain([
        d3.min(data, d => (d[y]*1000)-1),
        d3.max(data, d => (d[y]*1000)+1)
      ])
      .range([0,width])

    var xAxis = d3.axisBottom(xscale)
      .tickFormat( d => (new Date(d).getDate()+'/'+
                        (new Date(d).getMonth()+1)+'/'+
                        new Date(d).getFullYear().toString().substring(2,4)+', '+
                        new Date(d).getHours()+':'+
                        new Date(d).getMinutes()).toString().substring(0,20) )
    
    var yscale = d3.scaleBand()
      .range([0,height])

    var tooltip = d3.select('body')
      .append('div')
      .style('width', '170px')
      .style('height','85px')
      .style('background','#A7DEF2')
      .style('opacity','0.90')
      .style('position','absolute')
      .style('visibility','hidden')
      .style('padding','5px')
      .style('box-shadow','0px 0px 6px #7861A5')

    tooltip.append('div')

    var gy = g.append('g')

    gy.append('text')
      .attr('text-anchor','start')
      .attr('font-size','10px')
      .attr('fill','black')
      .attr('transform', 'translate('+(-5)+','+(-5)+')')
      .text(x+', '+z)

    gy.append('text')
      .attr('text-anchor','start')
      .attr('font-size','10px')
      .attr('fill','black')
      .attr('transform', 'translate('+(-5)+','+(height+15)+')')
      .text(w)

    //background
    g.append('rect')
      .attr('x', xscale(d3.min(xscale.domain())))
      .attr('y', 0)
      .attr('width', width)
      .attr('height', yscale.bandwidth())
      .attr('fill', 'lightgreen')
      .attr('opacity', '0.5')

    //appending a canvas for each element
    var bars = g.selectAll('.bar')
      .data(data)
      .enter().append('g')
        .attr('class','bar')

    //place each bar for each task on the time line
    var rects = bars.append('rect')
      .attr('x', d => xscale(d[y]*1000))
      .attr('y', d => -yscale.bandwidth()/4)
      .style('fill','white')
      .style('stroke-width', 2)
      .style('stroke', d => color(categories.indexOf(d[w])))
      .attr('width', 5)
      .attr('height', yscale.bandwidth()*1.5)
      .on('mousemove', d => {
        tooltip.style('visibility', 'visible')
          .style('height', (40+(d.value*25))+'px')
          .style('top',(d3.event.pageY-50)+'px')
          .style('left',(d3.event.pageX-180)+'px')
        tooltip.select('div')
          .html(x+' <b>'+d[x]+'</b>, <br />'+
            z+' <b>'+d[z]+'</b>, <br />'+
            'Task completed at: <br />'+
            '<strong>'+new Date(d[y]*1000).getDate()
            +'/'+((new Date(d[y]*1000).getMonth())+1)
            +'/'+new Date(d[y]*1000).getFullYear()
            +' at '+new Date(d[y]*1000).getHours()
            +':'+new Date(d[y]*1000).getMinutes()
            +':'+new Date(d[y]*1000).getSeconds()+'</strong>')
      })
      .on('mouseout', () => {
        tooltip.style('visibility', 'hidden')
      })
    
    //both labels for the time and the given answer
    var txt1 = bars.append('text')
      .attr('text-anchor','start')
      .attr('font-size','12px')
      .style('fill','black')
      .attr('font','10px')
      .attr('transform', d =>
        'translate('+xscale(d[y]*1000)+', '+(yscale.bandwidth()-(yscale.bandwidth()*1.3))+') rotate(-65)')
      .text(d => d[x]+', '+d[z])

    var txt2 = bars.append('text')
      .attr('text-anchor','middle')
      .attr('font-size','12px')
      .attr('font-weight','bold')
      .style('fill','black')
      .attr('transform', d =>
        'translate('+(xscale(d[y]*1000)+2.5)+', '+(yscale.bandwidth()*1.4)+')')
      .text(d => d[w])

    var gx = g.append('g')
      .attr('transform', 'translate(0,'+height+')')
      .call(xAxis)
    
    gx.selectAll('text')
        .attr('transform', 'rotate(-65)')
        .attr('text-anchor', 'end')
        .style('fill','darkgrey')
      
    gy.call(d3.axisLeft(yscale))

    function zoomFunction() {
      //create a new scale basing on the zoom event
      var newscale = d3.event.transform.rescaleX(xscale)
      xAxis = d3.axisBottom(newscale).tickFormat( 
        d => (new Date(d).getDate()+'/'+
              (new Date(d).getMonth()+1)+'/'+
              new Date(d).getFullYear().toString().substring(2,4)+', '+
              new Date(d).getHours()+':'+
              new Date(d).getMinutes()).toString().substring(0,20) )
      
      gx.call(xAxis)
      gx.selectAll('text')
        .attr('transform', 'rotate(-65)')
        .attr('text-anchor', 'end')
        .style('fill','darkgrey')

      //rescale components that are zoomed
      rects.attr('x', d => newscale(d[y]*1000))
      txt1.attr('transform', d =>
        'translate('+newscale(d[y]*1000)+', '+(yscale.bandwidth()-(yscale.bandwidth()*1.3))+') rotate(-65)')
      txt2.attr('transform', d =>
        'translate('+(newscale(d[y]*1000)+2.5)+', '+(yscale.bandwidth()*1.4)+')')
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
    return(
      <div>
        <br />
        <svg className={this.props.selector} width='700' height='210'> </svg>
      </div>
    )
  }
}

TimeLineChart.propTypes = {

}

const mapStateToProps = state => ({

})

const mapDispatchToProps = dispatch => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(TimeLineChart);

