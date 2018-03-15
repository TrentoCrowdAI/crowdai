import React from 'react'
import PropTypes from 'prop-types'
import * as d3 from 'd3'
import {connect} from 'react-redux'



class SimpleLineChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data
    }
    this.buildGraph = this.buildGraph.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  buildGraph() {
    //console.log(this.props)

    //selector necessary when displaying more different graphs on the same page,
    //to append them to different canvas/svg
    var svg = d3.select("."+this.props.selector);

    var margin = {top: 30, right: 30, bottom: 30, left: 30};
    var width = +svg.attr("width") - margin.left - margin.right;
    var height = +svg.attr("height") - margin.top - margin.bottom;
    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //we can choose on which parameters base our graph,
    //x and y coordinates are passe as props parameters
    var x = this.props.x
    var y = this.props.y

    //to order data basing on x-coordinate, to display a ordered line
    var data = this.state.data.sort( function(a,b) {
      return (a[x] > b[x]) ? 1 : ((b[x] > a[x]) ? -1 : 0);
      //return (a[y] > b[y]) ? 1 : ((b[y] > a[y]) ? -1 : 0);
    })

    //if we want to display different lines on the same graph,
    //to specify different colors
    var color = this.props.color

    //define x axis
    var xscale = d3.scaleLinear()
        .domain(d3.extent(data, d => d[x] ))
        .range([0, width]);
    var xAxis = d3.axisBottom(xscale);

    //define y axis
    var yscale = d3.scaleLinear()
        .domain(d3.extent(data, d => d[y] ))
        //.domain([0, d3.max(data, d => d[y] )])
        .range([height, 0]);
    var yAxis = d3.axisLeft(yscale);

    //define line
    var line = d3.line()
        .x( (d) => {return xscale(d[x])} )
        .y( (d) => {return yscale(d[y])} )
        //to make the line curved and not segmented
        .curve(d3.curveMonotoneX);

    g.append("path")
      .datum(data)
      .attr("class","line")
      .attr("d", line)
      .style("stroke", color)
      .style("fill","none")
      .style("stroke-width",2)

   g.selectAll(".dot")
      .data(data).enter()
        .append("circle")
        .style("fill", color)
        .attr("class","dot")
        .attr("cx", d => xscale(d[x]) )
        .attr("cy", d => yscale(d[y]) )
        .attr("r",5)
        //add HERE onClick events for the points in the graph
        .on("click", (d) => console.log(d))
        //point highlighted when mouse is over
        .on("mouseover", function() {
          d3.select(this)
          .style("opacity", "0.5")
        })
        .on("mouseout", function() {
          d3.select(this)
          .style("opacity","1")
        })

    //add axis
    g.append("g")
       .attr("class","x axis")
       .attr("transform","translate(0,"+height+")")
       .call(xAxis)
       .append("text")
          .attr("fill","black")
          .attr("transform","translate("+(width-10)+",0)")
          .attr("dy","-1em")
          .text(this.props.x);
    g.append("g")
       .attr("class","y axis")
       .call(yAxis)
       .append("text")
          .attr("fill","black")
          .attr("transform","rotate(-90)")
          .attr("text-anchor","end")
          .attr("dy","2em")
          .text(this.props.y);
  }

  componentDidMount() {
    this.buildGraph();
  }

  componentDidUpdate() {
    d3.select("."+this.props.selector).selectAll("g").remove();
    this.buildGraph();
  }

  handleClick() {
    //generating new data to update the chart
    this.setState({
        data : [{
          name: "rollo",
          altezza: "150",
          peso: "80"
        },{
          name: "faramir",
          peso: "40",
          altezza: "145"
        }]
      })
  }

  render() {
    console.log(this.state)
    return(
    <div>
    - Simple Line Chart -
      <svg className={this.props.selector} width="600" height="400"> </svg>
      <button onClick={this.handleClick} >Generate Data</button>
    </div>
  );
  }
}

SimpleLineChart.propTypes = {

}

const mapStateToProps = state => ({
})

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(SimpleLineChart);
