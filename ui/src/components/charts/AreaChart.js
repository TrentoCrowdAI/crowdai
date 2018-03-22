import React from 'react'
import PropTypes from 'prop-types'
import * as d3 from 'd3'
import {connect} from 'react-redux'

class AreaChart extends React.Component {
	constructor(props) {
		super(props);
		this.buildGraph = this.buildGraph.bind(this);
	}

	buildGraph() {
		var svg = d3.select("."+this.props.selector);
    var x = this.props.x
    var y = this.props.y

    var data = this.props.data.sort( function(a,b) {
      return (a[x] > b[x]) ? 1 : ((b[x] > a[x]) ? -1 : 0);
    })
    console.log(data)

    var margin = {top: 30, right: 30, bottom: 30, left: 30};
    var width = +svg.attr("width") - margin.left - margin.right;
    var height = +svg.attr("height") - margin.top - margin.bottom;
    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var color = this.props.color

    var xscale = d3.scaleTime()
        .range([0, width])
        .domain(d3.extent(data, d => d[x]))
    var xAxis = d3.axisBottom(xscale);

    var yscale = d3.scaleLinear()
        .range([height,0])
        .domain(d3.extent(data, d => d[y]))
    var yAxis = d3.axisLeft(yscale);

    var zoom = d3.zoom()
    		.scaleExtent([1,32])
    		.translateExtent([[0,0],[width,height]])
    		.extent([[0,0],[width,height]])
    		/*.on("zoom", function() {
    			var t = d3.event.transform.rescaleX(xscale);
    			g.select(".area").attr("d",area.xscale( d => t(d[x]) ));
    			g.select(".axis--x").call(xAxis.scale(t));
    		})*/

    var area = d3.area()
    		.curve(d3.curveMonotoneX)
    		.x( d => xscale(d[x]) )
    		.y0(height)
    		.y1( d => yscale(d[y]) )

    svg.append("defs").append("clipPath")
    		.attr("id","clip")
    	.append("rect")
    		.attr("width",width)
    		.attr("height",height)

    g.append("path")
    		.datum(data)
    		.attr("class","area")
    		.attr("d",area)
    		.style("fill", color)

    g.append("g")
    		.attr("class","axis axis--x")
    		.attr("transform","translate(0,"+height+")")
    		.call(xAxis)

    g.append("g")
    		.attr("class","axis axis--y")
    		.call(yAxis)
	}

	componentDidMount() {
		this.buildGraph();
	}

	componentWillUpdate() {
		d3.select("."+this.props.selector).selectAll("g").remove();
		this.buildGraph();
	}

	render() {
		return(
			<div>
			- Area Chart -
			<br />
			<svg className={this.props.selector} width='600' height='400'> </svg>
			<br />
			</div>
		);
	}
}

AreaChart.propTypes = {
  data : PropTypes.array
}

const mapStateToProps = state => ({

})

const mapDispatchToProps = dispatch => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(AreaChart);
