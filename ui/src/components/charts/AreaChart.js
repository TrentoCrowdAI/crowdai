import React from 'react'
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
    var color = 'steelblue'

    var xscale = d3.scaleLinear()
        .range([0, width])
    var xAxis = d3.axisBottom(xscale);

    var yscale = d3.scaleLinear()
        .range([height,0])
    var yAxis = d3.axisLeft(yscale);

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

    xscale.domain(d3.extent(data, d => d[x]))
    yscale.domain([0, d3.max(data, d => d[y])])

    g.append("path")
    		.datum(data)
    		.attr("class","area")
    		.attr("d",area)
    		.style("fill", color)
    		.style("clip-path", "url(#clip)")

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
}

const mapStateToProps = state => ({

})

const mapDispatchToProps = dispatch => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(AreaChart);