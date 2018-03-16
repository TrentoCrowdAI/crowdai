import React from 'react'
import { connect } from 'react-redux'
import * as d3 from 'd3'
import PropTypes from 'prop-types'
import Math from 'math'

var count = 0;

class Histogram extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data
    }
    this.buildGraph = this.buildGraph.bind(this);
    this.handleConcat = this.handleConcat.bind(this);
    this.handleReduce = this.handleReduce.bind(this);
  }

  buildGraph() {
    var svg = d3.select("."+this.props.selector);
    var x = this.props.x
    //var y = this.props.y

    var data = this.state.data.sort( function(a,b) {
      return (a[x] > b[x]) ? 1 : ((b[x] > a[x]) ? -1 : 0);
    })

    var margin = {top: 30, right: 30, bottom: 30, left: 30};
    var width = +svg.attr("width") - margin.left - margin.right;
    var height = +svg.attr("height") - margin.top - margin.bottom;
    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var color = this.props.color

    var xscale = d3.scaleLinear()
        .range([0, width])
        .domain(d3.extent(data, d => d[x]))
    var xAxis = d3.axisBottom(xscale);

    var yscale = d3.scaleLinear()
        .domain([0, data.length])
        .range([height,0])
    var yAxis = d3.axisLeft(yscale);

    var histo = d3.histogram()
    .domain(d3.extent(data, d => d[x]))
    (data.map(d => d[x]));

    var bar = g.selectAll(".bar")
        .data(histo)
        .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function(d) {
          //console.log(d.x0,d.x1,d.length)
          return "translate(" + xscale(d.x0) + "," + yscale(d.length) + ")"; });

    bar.append("rect")
          .style("fill", color)
          .attr("x", 1)
          .attr("width", function(d) { return xscale(d.x1)-xscale(d.x0)-1 })
          .attr("height", function(d) { return height - yscale(d.length); })
          .on("mouseover", function() {
            d3.select(this).style("opacity","0.8")
          })
          .on("mouseout", function() {
            d3.select(this).style("opacity","1")
          })
          .on("click", function(d) {
            //console.log elements of the selection
          })

    bar.append("text")
          .attr("dy", ".75em")
          .attr("y", function(d) { return -15 })
          .attr("x", function(d) { return (xscale(d.x1)-xscale(d.x0))/2 })
          .attr("text-anchor", "middle")
          .style("fill", color)
          .text(function(d) { return d.length })

    g.append("g")
       .attr("class","x axis")
       .attr("transform","translate(0,"+height+")")
       .call(xAxis)
       .append("text")
          .attr("fill","black")
          .attr("transform","translate("+(width-15)+",0)")
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
          .text("# objects");
  }

  componentDidMount() {
    this.buildGraph();
  }

  componentDidUpdate() {
    d3.select("."+this.props.selector).selectAll("g").remove();
    this.buildGraph();
  }

  handleConcat() {
    var num = Math.floor(Math.random()*10)+1;
    for(var i=0; i<num; i++) {
      this.setState(prevState => ({
        data: prevState.data.concat(
          [{
            name: "nuovodato"+(count++).toString(),
            altezza: (Math.floor(Math.random()*100)+100).toString(),
            peso: (Math.floor(Math.random()*80)+40).toString()
          }]
        )
      }))
    }
  }

  handleReduce() {
    this.setState(prevState => ({
      data: prevState.data.splice(1,1)
    }))
    count=0;
  }

  render() {
    console.log(this.state)
    return (
      <div>
      - Histogram -
        <svg className={this.props.selector} width="600" height="400"> </svg>
        <button onClick={this.handleConcat}>Concat Data</button>
        <button onClick={this.handleReduce} style={{'backgroundColor': 'red'}}>Reduce Data</button>
      </div>
    );
  }
}

Histogram.propTypes = {

}

const mapStateToProps = state => ({

})

const mapDispatchToProps = dispatch => ({

})

export default connect (mapStateToProps,mapDispatchToProps)(Histogram)
