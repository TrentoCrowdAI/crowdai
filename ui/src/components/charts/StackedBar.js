import React from 'react'
import { connect } from 'react-redux'
import * as d3 from 'd3'
import PropTypes from 'prop-types'
import Math from 'math'

class StackedBar extends React.Component {
  constructor(props) {
    super(props);
    this.buildGraph = this.buildGraph.bind(this);
  }

  buildGraph() {
		var svg = d3.select("."+this.props.selector);
		
  	var y = this.props.y
    var x = this.props.x
    var z = this.props.z
		var param = this.props.param

		var data = this.props.data
			.sort( (a,b) => Number(a[x])>Number(b[x]) ? 1 : Number(a[x])<Number(b[x]) ? -1 : Number(a[z])>Number(b[z]) ? 1 : Number(a[z])<Number(b[z]) ? -1 : 0 )
			.filter(d => param[0]==='all' && param[1]==='all' ? true 
				: param[0]!=='all' && param[1]==='all' ? d[x]===param[0]
				: param[0]==='all' && param[1]!=='all' ? d[z]===param[1]
				: param[0]!=='all' && param[1]!=='all' ? d[x]===param[0] && d[z]===param[1] 
				: false )

    var margin = {top: 30, right: 30, bottom: 30, left: 50};
		var width = +svg.attr("width") - margin.left - margin.right;
		svg.attr('height',(data.length+1)*50)
    var height = +svg.attr("height") - margin.top - margin.bottom;
    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    var color = d3.scaleOrdinal()
    		.range(['orange','lightgreen','steelblue'])

    var yscale = d3.scaleBand()
    		.rangeRound([0, height])

    var xscale = d3.scaleLinear()
    		.range([0, width])

    var xAxis = d3.axisTop().scale(xscale)
    var yAxis = d3.axisLeft().scale(yscale)

    var rowsNames = data.map( d => d[x]+','+d[z])
    var neutralIndex = Math.floor(Object.values(y).length/2)

    color.domain(y)

    data.forEach( function(row) {
    		row.total = d3.sum(y.map(name => +row[name]))
    		y.forEach(name => row['relative'+name]=(row.total!==0 ? +row[name]/row.total : 0))

    		var x0 = -1*d3.sum(y.map((name,i) => i<neutralIndex ? +row['relative'+name] : 0))
    		if(y.length & 1) { x0 += -1*row['relative'+y[neutralIndex]]/2 }
    		var idx = 0

    		row.boxes = y.map( function(name) {
    			return {
    			name: name,
    			x0: x0,
    			x1: x0+=row['relative'+name],
    			total: row.total,
    			absolute: row[name]
    		}})
    })

    var min = d3.min(data, d => d.boxes[0].x0)
    var max = d3.max(data, d => d.boxes[d.boxes.length-1].x1)

    xscale.domain([min, max]).nice()
    yscale.domain(rowsNames)

    g.append("g")
    	.attr("class","x axis")
    	.call(xAxis)

    g.append("g")
    	.attr("class","y axis")
    	.call(yAxis)

    var rows = g.selectAll(".row")
    		.data(data)
    	.enter().append("g")
    		.attr("class","bar")
    		.attr("transform", d => "translate(0,"+yscale(d[x]+','+d[z])+")")
    		.on("mouseover", function(d) {
    			d3.select(this).style("opacity","0.8")
    			/*g.selectAll(".y").selectAll("text").filter( function(text) {
    				return text === d[x]+','+d[z] })
    				.transition().duration(100).style('font','15px sans-serif')*/
    		})
    		.on("mouseout", function(d) {
    			d3.select(this).style("opacity","1")
    			/*g.selectAll(".y").selectAll("text").filter( function(text) {
    				return text === d[x]+','+d[z] })
    				.transition().style('font','10px sans-serif')*/
    		})

    var bars = rows.selectAll("rect")
    		.data(d => d.boxes)
    	.enter().append("g")

    bars.append("rect")
    	.attr("height", yscale.bandwidth()-10)
    	.attr("x", d => xscale(d.x0))
    	.attr("width", d => xscale(d.x1)-xscale(d.x0))
    	.style("fill", d => color(d.name))

    	bars.append("text")
    		.attr("x", d => xscale(d.x0))
    		.attr("y", (yscale.bandwidth()-10)/2)
    		.attr("dy", "0.5em")
    		.attr("dx", "0.5em")
				.style("text-anchor","begin")
				.attr("fill","white")
    		.text(d => d.absolute !==0 && (d.x1-d.x0)>0.04 ? d.absolute+", "+d.name : "")

    	g.append("g")
    			.attr("class", "y axis")
    		.append("line")
    			.attr("x1", xscale(0))
    			.attr("x2", xscale(0))
    			.attr("y2", height)
    			.style("stroke", "#000")

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
    		<svg className={this.props.selector} width="1000" height="600"> </svg>
    	</div>
    );
  }
}

StackedBar.propTypes = {

}

const mapStateToProps = state => ({

})

const mapDispatchToProps = dispatch => ({

})

export default connect (mapStateToProps,mapDispatchToProps)(StackedBar)
