import React from 'react'
import PropTypes from 'prop-types'
import * as d3 from 'd3'
import {connect} from 'react-redux'


class CompareLineChart extends React.Component {
  constructor(props) {
    super(props);
    this.buildGraph = this.buildGraph.bind(this);
    this.dataWrapper = this.dataWrapper.bind(this);
  }

  dataWrapper() {
    if(this.props.data.length==0) {
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
    
    var color = this.props.color
    var x = this.props.x
    var y = this.props.y
    var z = this.props.z
    var data = this.props.data.sort( (a,b) => a[y]<b[y] ? 1 : a[y]>b[y] ? -1 : 0 )
    
    var xscale = d3.scaleBand()
        .domain( data.map(d => d[x[0]]+", "+d[x[1]]) )
        .range([0,width])
        //.range(data.map( (d,i) => i*(width/data.length)))
    var xAxis = d3.axisBottom(xscale)
      .tickFormat("")

    var yscale = d3.scaleLinear()
        .domain(d3.extent(data, d => d[y]))
        .range([height, 0])
    var yAxis = d3.axisLeft(yscale);

    var tooltip = d3.select('body')
        .append('div')
        .style('width','240px')
        .style('height','80px')
        .style('background','steelblue')
        .style('opacity','0.90')
        .style('position','absolute')
        .style('visibility','hidden')
        .style('padding','10px')
        .style('box-shadow','0px 0px 6px #7861A5')

    var toolval = tooltip.append('div')

    var gx = g.append("g")
       .attr("class","x axis")
       .attr("transform","translate(0,"+height+")")
       .call(xAxis)
       .selectAll("text")
          .attr("text-anchor","end")
          .attr("dx","-.8em")
          .attr("dy","-.5em")
          .attr("transform","rotate(-65)")

    var gy = g.append("g")
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

    var view = g.append("rect")
      .attr("class","zoom")
      .attr("width", width)
      .attr("height", height)
      .call(zoom)

    var points1 = g.selectAll(".dot2")
      .data(data).enter()
        .append("circle")
        .style("fill", 'steelblue')
        .attr("class","dot2")
        .attr("cx", d => xscale(d[x[0]]+", "+d[x[1]]) )
        .attr("cy", d => yscale(d[y]) )
        .attr("r",2)
        .on("mouseover", d => {
          tooltip.style('visibility', 'visible')
              .style('top',(d3.event.pageY-30)+'px')
              .style('left',(d3.event.pageX-260)+'px')
          tooltip.select('div')
              .html('Worker A: <b>'+d[x[0]].toUpperCase()+'</b>,'+
                  '<br />Worker B: <b>'+d[x[1]].toUpperCase()+'</b>,'+
                  '<br />'+y+' => <b>'+d[y].toFixed(2)+'</b>')
        })
        .on("mouseout", d => tooltip.style('visibility', 'hidden'))

    var points2 = g.selectAll(".dot")
      .data(data).enter()
        .append("circle")
        .style("fill", 'orange')
        .attr("class","dot")
        .attr("cx", d => xscale(d[x[0]]+", "+d[x[1]]) )
        .attr("cy", d => yscale(d[z]) )
        .attr("r",2)
        .on("mouseover", d => {
          tooltip.style('visibility', 'visible')
              .style('top',(d3.event.pageY-30)+'px')
              .style('left',(d3.event.pageX-260)+'px')
          tooltip.select('div')
              .html('Worker A: <b>'+d[x[0]].toUpperCase()+'</b>,'+
                  '<br />Worker B: <b>'+d[x[1]].toUpperCase()+'</b>,'+
                  '<br />'+z+' => <b>'+d[z].toFixed(2)+'</b>')
        })
        .on("mouseout", d => tooltip.style('visibility', 'hidden'))

    function zoomFunction() {
      //to zoom x axis
      xscale.range([0,width].map(d => d3.event.transform.applyX(d)))

      line1.x(d => xscale(d[x[0]]+", "+d[x[1]]))
      line2.x(d => xscale(d[x[0]]+", "+d[x[1]]))

      path1.attr("d",line1)
      path2.attr("d",line2)
      /*points1.attr("r", )
      points2.attr("r", )*/
      points1.attr("cx", d => xscale(d[x[0]]+", "+d[x[1]]) )
      points2.attr("cx", d => xscale(d[x[0]]+", "+d[x[1]]) )

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
    return(
      <div>
        <svg className={this.props.selector} width="1000" height="500"> </svg>
        <br />
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

