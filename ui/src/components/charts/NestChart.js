import React from 'react'
import { connect } from 'react-redux'
import * as d3 from 'd3'
import PropTypes from 'prop-types'
import Math from 'math'

class Histogram extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
      clicked: []
    }
    this.buildGraph = this.buildGraph.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  buildGraph() {
    var svg = d3.select("."+this.props.selector);
    var x = this.props.x
    var y = this.props.y

    var data = this.props.data.sort( function(a,b) {
      return (a[x] > b[x]) ? 1 : ((b[x] > a[x]) ? -1 : 0);
    })

    var margin = {top: 30, right: 30, bottom: 30, left: 30};
    var width = +svg.attr("width") - margin.left - margin.right;
    var height = +svg.attr("height") - margin.top - margin.bottom;
    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var color = this.props.color

    var bw = Math.floor(width/data.length)-1

    var xscale = d3.scaleLinear()
        .range([bw/2, width-bw/2])
    var xAxis = d3.axisBottom(xscale);

    var yscale = d3.scaleLinear()
        .range([height,0])
    var yAxis = d3.axisLeft(yscale);

    var times = g.append("g")
        .attr("class","times");

    xscale.domain(d3.extent(data, d => d[x]))
    yscale.domain([0,d3.max(data, d => d[y])])

    nest = d3.nest()
        .key(d => d[x])
        .rollup(v => v.map(d => d[y]))
        .map(data)

    g.append("g")
        .attr("class", "y axis")
        .attr("transform","translate("+width+",0)")
        .call(yAxis)
      .selectAll("g")
      .filter( d => !d )
        .classed("zero", true)

    var time = times.selectAll(".time")
        .data(d3.range(d3.extent(data, d => d[x])))
        


  }

  componentDidMount() {
    this.buildGraph();
  }

  componentDidUpdate() {
    d3.select("."+this.props.selector).selectAll("g").remove();
    this.buildGraph();
  }

  render() {

    return (
      <div>
      - Histogram -
        <br />
        <strong>Clicked data:</strong> <ul></ul>
        <svg className={this.props.selector} width="600" height="400"> </svg>
        <br />
        <button>Total Time statistics</button>
        <button>Average Time statistics</button>
        <button>Standard Time statistics</button>
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
