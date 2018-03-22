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
  }

  buildGraph() {
    //console.log(this.props.color+' chart STATE: ',this.state)
    //console.log(this.props.color+' chart PROPS: ',this.state)

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
    var data = this.props.data.sort( function(a,b) {
      return (a[x] > b[x]) ? 1 : ((b[x] > a[x]) ? -1 : 0);
      //return (a[y] > b[y]) ? 1 : ((b[y] > a[y]) ? -1 : 0);
    })
    console.log(data)
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

    //define line
    var line = d3.line()
        .x( (d) => {return xscale(d[x])} )
        .y( (d) => {return yscale(d[y])} )
        //to make the line curved and not segmented
        .curve(d3.curveMonotoneX);

    g.append("path")
      .datum(data)
      .attr("class","original")
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
        .on("click", (d) => {
          console.log("points on clicked data: ")
          data.map(step => {
            if(step[x] === d[x] && step[y] === d[y]) {
              console.log(step)
            }
          })
        })
        .call(d3.drag()
          .on("drag", function(d) {
            d[x] = Math.round(xscale.invert(d3.event.x))
            d[y] = Math.round(yscale.invert(d3.event.y))
            console.log(d)

            d3.select(this)
            .attr("cx",xscale(d[x]))
            .attr("cy",yscale(d[y]))

            g.select(".line").remove()

            g.append("path")
              .datum(data)
              .attr("class","line")
              .attr("d", line)
              .style("stroke", "dark"+color)
              .style("fill","none")
              .style("stroke-width",2)
          })
          .on("end", function() {

            g.selectAll(".line").remove()

            data.sort( function(a,b) {
              return (a[x] > b[x]) ? 1 : ((b[x] > a[x]) ? -1 : 0);
            })

            g.append("path")
              .datum(data)
              .attr("class","line")
              .attr("d", line)
              .style("stroke", "dark"+color)
              .style("fill","none")
              .style("stroke-width",2)
          })
        )
        .on("mouseover", function() {
          d3.select(this)
          .style("opacity", "0.5")
        })
        .on("mouseout", function() {
          d3.select(this)
          .style("opacity","1")
        })

  }

  componentDidMount() {
    this.buildGraph();
  }

  componentDidUpdate() {
    d3.select("."+this.props.selector).selectAll("g").remove();
    this.buildGraph();
  }

  render() {
    return(
      <div>
      - Simple Line Chart -
        <br />
        <svg className={this.props.selector} width="600" height="400"> </svg>
        <br />
        <button onClick={this.props.handleConcat}>Concat Data</button>
        <button onClick={this.props.handleReduce} style={{color: 'red'}}>Reduce Data</button>
        <button style={{color: 'green'}}>Apply Change</button>
      </div>
    )
  }
}

SimpleLineChart.propTypes = {
  data : PropTypes.array
}

const mapStateToProps = state => ({

})

const mapDispatchToProps = dispatch => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(SimpleLineChart);
