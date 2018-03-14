import React from 'react'
import PropTypes from 'prop-types'
import * as d3 from 'd3'
import {connect} from 'react-redux'

var chartData = [{
  name: "will",
  x: "160",
  y: "69"
},{
  name: "rob",
  x: "185",
  y: "90"
},{
  name: "july",
  x: "165",
  y: "45"
},{
  name: "fabio",
  x: "177",
  y: "65"
},{
  name: "rocky",
  x: "170",
  y: "88"
}]

class SimpleLineChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: chartData,
      x: 'x',
      y: 'y'
    }
  }

  componentDidMount() {
    console.log(this.props)
    var svg = d3.select(".simpleline-chart").attr("transform", "translate(20,20)");
    var margin = {top: 50, right: 50, bottom: 50, left: 50};
    var width = +svg.attr("width") - margin.left - margin.right;
    var height = +svg.attr("height") - margin.top - margin.bottom;
    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var data = chartData.sort( function(a,b) {
      return (a.x > b.x) ? 1 : ((b.x > a.x) ? -1 : 0);
    })

    var x = this.props.x
    var y = this.props.y

    //define x axis
    var xscale = d3.scaleLinear()
        .domain(d3.extent(data, d => d[x] ))
        .range([0, width]);
    var xAxis = d3.axisBottom(xscale);

    //define y axis
    var yscale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d[y] )])
        .range([height, 0]);
    var yAxis = d3.axisLeft(yscale);

    //define line
    var line = d3.line()
        .x( (d) => {return xscale(d[x])} )
        .y( (d) => {return yscale(d[y])} )
        .curve(d3.curveMonotoneX);

    svg.append("path")
      .datum(data)
      .attr("class","line")
      .attr("d", line)
      .style("stroke","red")
      .style("fill","none")
      .style("stroke-width",2)

   svg.selectAll(".dot")
      .data(data).enter()
        .append("circle")
        .style("fill","red")
        .attr("class","dot")
        .attr("cx", d => xscale(d[x]) )
        .attr("cy", d => yscale(d[y]) )
        .attr("r",5)
        .on("click", d => console.log(d))
        .on("mouseover", d =>
          d3.select(this)
          .style("fill","blue")
        )
        .on("mouseout", d =>
          d3.select(this)
          .style("fill","red")
        )

    //add axis
    svg.append("g")
       .attr("class","x axis")
       .attr("transform","translate(0,"+height+")")
       .call(xAxis)
       .append("text")
          .attr("fill","black")
          .attr("transform","translate(650,0)")
          .attr("dy","-1em")
          .attr("text-anchor","middle")
          .text("Peso (kg)");
    svg.append("g")
       .attr("class","y axis")
       .call(yAxis)
       .append("text")
          .attr("fill","black")
          .attr("transform","rotate(-90)")
          .attr("dy","2em")
          .attr("text-anchor","end")
          .text("Altezza (cm)");

  }

  render() {
    return(
    <div>
      -- Trying simple charting --
      <hr />
      <svg className="simpleline-chart" width="800" height="600"> </svg>
      <hr />
    </div>
  );
  }
}

SimpleLineChart.propTypes = {
  onPointClicked: PropTypes.func,
  data: PropTypes.array
}

const mapStateToProps = state => ({
  x: 'x'
})

const mapDispatchToProps = dispatch => ({
  y: 'y'
})

export default connect(mapStateToProps, mapDispatchToProps)(SimpleLineChart);
