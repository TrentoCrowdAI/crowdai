import React from 'react'
import PropTypes from 'prop-types'
import * as d3 from 'd3'
import { connect } from 'react-redux'

class Histogramtwo extends React.Component {
  constructor(props) {
		super(props);
		this.state = {
			data: this.props.data
		}
		this.buildGraph = this.buildGraph.bind(this)
	}

	buildGraph() {
		console.log("data props: ", this.props.data)
		var svg = d3.select("."+this.props.selector);
    var x = this.props.x;
    var y = this.props.y;
    var data = this.props.data.sort( function(a,b) {
      return (a[x] > b[x]) ? 1 : ((b[x] > a[x]) ? -1 : 0);
    })

    var margin = {top: 30, right: 30, bottom: 30, left: 30};
    var width = +svg.attr("width") - margin.left - margin.right;
    var height = +svg.attr("height") - margin.top - margin.bottom;
    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var color = this.props.color;

    var xscale = d3.scaleLinear()
    			.domain(d3.extent(data, d => d[x]))
    			.range([0, width]);
    var xAxis = d3.axisBottom(xscale);

    var yscale = d3.scaleLinear()
    			.domain([0, data.length])
    			.range([height, 0])
    var yAxis = d3.axisLeft(yscale);

    var values = d3.histogram()
    			.thresholds(xscale.ticks(10))
    			(data.map(d => d[x]));

   	var bar = g.selectAll(".bar")
   				.data(values)
   				.enter().append("g")
   					.attr("class","bar")
   					.attr("transform", function(d) {
	   					return "translate("+xscale(d.x0)+","+yscale(d.length)+")";
  	 				})

   	bar.append("rect")
          .style("fill", "red")
          .attr("x", 1)
          .attr("width", function(d) { return xscale(d.x1)-xscale(d.x0)-1 })
          .attr("height", function(d) { return height - yscale(d.length); })
   						
   	g.append("g")
   			.attr("class","x axis")
   			.attr("transform","translate(0,"+height+")")
   			.call(xAxis)


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
			- Historgram two -
				<br />
				<svg className={this.props.selector} width='600' height='400'> </svg>
			</div>
		);
	}

}

Histogramtwo.propTypes = {

}

const mapStateToProps = state => ({

})

const mapDispatchToProps = dispatch => ({

})

export default connect (mapStateToProps,mapDispatchToProps)(Histogramtwo)