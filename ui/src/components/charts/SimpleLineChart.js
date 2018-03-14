import React from 'react'
import PropTypes from 'prop-types'
import * as d3 from 'd3'
import {connect} from 'react-redux'

var chartData = [{
  name: "will",
  altezza: "160",
  peso: "69"
},{
  name: "rob",
  altezza: "185",
  peso: "90"
},{
  name: "july",
  peso: "45",
  altezza: "165"
},{
  name: "fabio",
  altezza: "177",
  peso: "65"
},{
  name: "rocky",
  altezza: "170",
  peso: "88"
}]

class SimpleLineChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: chartData
    }
  }

  componentDidMount() {
    console.log(this.props)
    var svg = d3.select("."+this.props.selector).attr("transform", "translate(20,20)");
    var margin = {top: 50, right: 50, bottom: 50, left: 50};
    var width = +svg.attr("width") - margin.left - margin.right;
    var height = +svg.attr("height") - margin.top - margin.bottom;
    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = this.props.x
    console.log(x)
    var y = this.props.y
    console.log(y)

    var data = chartData.sort( function(a,b) {
      return (a[x] > b[x]) ? 1 : ((b[x] > a[x]) ? -1 : 0);
    })
    var color = this.props.color
    //define x axis
    var xscale = d3.scaleLinear()
        .domain(d3.extent(data, d => d[x] ))
        .range([0, width]);
    var xAxis = d3.axisBottom(xscale);

    //define y axis
    var yscale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d[y] )])
        .range([height, 0]);
    var yAxis = d3.axisRight(yscale);

    //define line
    var line = d3.line()
        .x( (d) => {return xscale(d[x])} )
        .y( (d) => {return yscale(d[y])} )
        .curve(d3.curveMonotoneX);

    svg.append("path")
      .datum(data)
      .attr("class","line")
      .attr("d", line)
      .style("stroke",color)
      .style("fill","none")
      .style("stroke-width",2)

   svg.selectAll(".dot")
      .data(data).enter()
        .append("circle")
        .style("fill", color)
        .attr("class","dot")
        .attr("cx", d => xscale(d[x]) )
        .attr("cy", d => yscale(d[y]) )
        .attr("r",5)
        .on("click", (d) => console.log(d))
        .on("mouseover", function() {
          d3.select(this)
          .style("fill","yellow")
        })
        .on("mouseout", function() {
          d3.select(this)
          .style("fill", color)
        })

    //add axis
    svg.append("g")
       .attr("class","x axis")
       .attr("transform","translate(0,"+height+")")
       .call(xAxis)
       .append("text")
          .attr("fill","black")
          .attr("transform","translate(670,0)")
          .attr("dy","-1em")
          .text(this.props.x);
    svg.append("g")
       .attr("class","y axis")
       .call(yAxis)
       .append("text")
          .attr("fill","black")
          .attr("transform","rotate(-90)")
          .attr("text-anchor","end")
          .attr("dy","4em")
          .text(this.props.y);

  }

  render() {
    return(
    <div>
      <svg className={this.props.selector} width="800" height="600"> </svg>
    </div>
  );
  }
}

SimpleLineChart.propTypes = {
  onPointClicked: PropTypes.func,
  data: PropTypes.array
}

const mapStateToProps = state => ({
})

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(SimpleLineChart);
