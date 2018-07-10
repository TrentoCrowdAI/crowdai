import React from 'react'
import PropTypes from 'prop-types'
import * as d3 from 'd3'
import {connect} from 'react-redux'

class PointChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked: []
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
        .text("No data in this Job yet")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    } else { 
      this.buildGraph()
    }
  }

  buildGraph() {
    var svg = d3.select("."+this.props.selector);
    var margin = {top: 30, right: 30, bottom: 40, left: 40};
    var width = +svg.attr("width") - margin.left - margin.right;
    var height = +svg.attr("height") - margin.top - margin.bottom;
    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    var x = this.props.x
    var y = this.props.y
    var z = this.props.z
    var w = this.props.w
    var param = this.props.param
    var data = this.props.data.sort( (a,b) => 
      Math.abs(a[y]-a[z])>Math.abs(b[y]-b[z]) ? 1 : Math.abs(a[y]-a[z])<Math.abs(b[y]-b[z]) ? -1 : 0
    )

    //console.log('point workers:',data)

    var colors = ['#FFCD9A', '#FFB366', '#FF9A33', '#FF8000', 'red']
    var colorscale = d3.scaleOrdinal(colors)
    
    var xscale = d3.scaleLinear()
      .range([0,width])
      .domain([0,100])
      //.domain(d3.extent(data, d => d[y]))

    var yscale = d3.scaleLinear()
      .range([height, 0])
      .domain([0,100])
      //.domain(d3.extent(data, d => d[z]))

    var xAxis = d3.axisBottom(xscale)

    var yAxis = d3.axisLeft(yscale)

    var dots = g.selectAll(".dot")
      .data(data).enter()
        .append("circle")
        .style("fill", d => 
          Math.abs(d[y]-d[z])==0 ? 'lightgreen'
          : Math.abs(d[y]-d[z])<=10 ? '#FFCD9A' 
          : Math.abs(d[y]-d[z])<=30 ? '#FFB366'
          : Math.abs(d[y]-d[z])<=50 ? '#FF9A33'
          : Math.abs(d[y]-d[z])<=70 ? '#FF8000'
          : Math.abs(d[y]-d[z]) ? 'red' : 'lightgreen'
        )
        .attr("class","dot")
        .attr("cx", d => xscale(d[y]) )
        .attr("cy", d => yscale(d[z]))
        .attr("r", d => d[param]/(d3.max(data, d => d[param]))<1 ? d[param]/(d3.max(data, d => d[param]))*15 : d[param]/(d3.max(data, d => d[param]))*10 )
        .style('stroke', 'white')
        .style('opacity', '0.9')
        .style('stoke-width', 1)
        .on('click', d =>
          w(null, {'value': d[x] })
        )
        .on('mouseover', function() {
          d3.select(this)
            .style('opacity', '0.7')
            .style('stroke', '#2185d0')
            .style('stroke-width', 2)
        })
        .on('mouseout', function() {
          d3.select(this)
            .style('opacity', '0.9')
            .style('stroke', 'white')
            .style('stroke-width', 1)
        })

    dots.append('title')
      .text(d => 
        x+': '+d[x]
        +'\n'+y+': '+d[y].toFixed(1)+'%'
        +'\n'+z+': '+d[z].toFixed(1)+'%')

    g.append("g")
      .attr("class","x axis")
      .attr("transform","translate(0,"+height+")")
      .call(xAxis)
      .append('text')
        .attr('text-anchor', 'end')
        .style('fill', 'black')
        .style('font-size', '10px')
        .attr('transform', 'translate('+width+','+30+')')
        .text(y)
 
    g.append("g")
      .attr("class","y axis")
      .call(yAxis)
      .append('text')
        .attr('text-anchor', 'end')
        .attr('transform', 'translate(-30,0) rotate(-90)')
        .style('fill', 'black')
        .style('font-size', '10px')
        .text(z)

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
        <svg className={this.props.selector} width="900" height="300"> </svg>
        <br />
      </div>
    )
  }
}

PointChart.propTypes = {

}

const mapStateToProps = state => ({

})

const mapDispatchToProps = dispatch => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(PointChart);
