import React from 'react'
import { connect } from 'react-redux'
import * as d3 from 'd3'
import PropTypes from 'prop-types'
import Math from 'math'

class HeatMap extends React.Component {
	constructor(props) {
		super(props);

	}

	buildGraph() {
		var svg = d3.select("."+this.props.selector);

    var margin = {top: 30, right: 30, bottom: 30, left: 30};
    var width = +svg.attr("width") - margin.left - margin.right;
    var height = +svg.attr("height") - margin.top - margin.bottom;
    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var x = this.props.x
    var y = this.props.y

    var data = this.props.data.sort( function(a,b) {
      return (a[x] > b[x]) ? 1 : ((b[x] > a[x]) ? -1 : 0);
    })
    console.log(data)

    var xelems = d3.set(data.map(d => d[x])).values()
    var yelems = d3.set(data.map(d => d[y])).values().sort( (a,b) => {
    	return (a>b ? 1 : b>a ? -1 : 0)
    })
    console.log("x "+x+" elems: ", xelems)
    console.log("y "+y+" elems: ", yelems)

   	var xcards = xelems.map( xstep => {
   		var count = 0
   		yelems.map( ystep => {
   			data.map( step => {
   				if( step[x] == xstep
   						&& step[y] == ystep ) {
   					return count++;
   				}
   			})
   			return count
   		})
   		return count
   	})
    console.log("cardinalità x: ", xcards)

    var ycards = yelems.map( step => {
   		var count = 0
   		data.map( d => {
   			if(d[y].toString() == step) count ++
   		})
   		return count
   	})
    console.log("cardinalità y: ", ycards)

    var gridsize = Math.floor(height/(data.length));
    var buckets = data.length;
    var colors = ['yellow','orange','brown'];

    var ylabels = g.selectAll('.yLabels')
				.data(yelems).enter()
					.append("text")
    			.text( d => d )
    			.attr("x",0)
    			.attr("y", (d,i) => i*gridsize )
    			.style("text-anchor","end")
    			.attr("transform","translate(-6,"+ ((gridsize/2)+5) +")")
    			.attr("class", "yLabels mono axis")

		var xlabels = g.selectAll('.xLabels')
				.data(xelems).enter()
					.append("text")
					.text( d => d )
					.attr("x", (d,i) => i*gridsize )
					.attr("y",0)
					.style("text-anchor","middle")
					.attr("transform","translate("+ gridsize/2 +",-6)")
					.attr("class", "xLabels mono axis")

		var colorscale = d3.scaleQuantile()
    		.domain(d3.extent(xcards))
    		.range(colors);

		var cards = g.selectAll(".element")
    		.data(data)
    		.enter().append("rect")
    		.attr("x", d => xelems.indexOf(d[x].toString())*gridsize )
    		.attr("y", d => yelems.indexOf(d[y].toString())*gridsize )
    		.attr("rx", 4)
    		.attr("ry", 4)
    		.attr("class","element")
    		.attr("width", gridsize-2)
    		.attr("height", gridsize-2)
    		.style("fill", d => colorscale( xcards[ xelems.indexOf(d[x].toString()) ] ))

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
			- HeatMap -
			<br />
			<svg className={this.props.selector} height='500' width='600'> </svg>
			<br />
			<button onClick={this.props.handleConcat}>Concat Data</button>
        <button onClick={this.props.handleReduce} style={{color: 'red'}}>Reduce Data</button>
			</div>
		);
	}
}

const mapStateToProps = state => ({

})

const mapDispatchToProps = dispatch => ({

})

export default connect (mapStateToProps,mapDispatchToProps)(HeatMap)
