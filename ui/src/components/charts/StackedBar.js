import React from 'react'
import { connect } from 'react-redux'
import * as d3 from 'd3'
import PropTypes from 'prop-types'
import Math from 'math'

class StackedBar extends React.Component {
  constructor(props) {
    super(props);
    /*this.state = {
      data : this.props.data
    }*/
    this.buildGraph = this.buildGraph.bind(this);
  }

  buildGraph() {
  	var svg = d3.select("."+this.props.selector);
    var c1 = this.props.y[0]
    var c2 = this.props.y[1]
    var c3 = this.props.y[2]

    var x = this.props.x

    var data = this.props.data

    var margin = {top: 30, right: 30, bottom: 30, left: 30};
    var width = +svg.attr("width") - margin.left - margin.right;
    var height = +svg.attr("height") - margin.top - margin.bottom;
    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    var color = d3.scaleOrdinal()
    		.range(["#f6a580", "#cccccc", "#92c6db"])

    var yscale = d3.scaleOrdinal()
    		.range([10, 30, 50, 70, 90, 110, 130, 150, 170, 190])

    var xscale = d3.scaleLinear()
    		.range([0, width])

    var xAxis = d3.axisTop().scale(xscale).tickFormat(d3.format(",%"))
    var yAxis = d3.axisLeft().scale(yscale).tickSize(0)

    //color.domain(["Disagree", "Neutral", "Agree"])
	
    /*data.forEach(function(d) {
    	var sum = d[c1]+d[c2]+d[c3]
    	//console.log(d)
    	d['Disagree'] = +d[c1]*100/sum
    	//console.log(d['Disagree'])
    	d['Neutral'] = +d[c2]*100/sum
    	//console.log(d['Neutral'])
    	d['Agree'] = +d[c3]*100/sum
    	//console.log(d['Agree'])
    	var x0 = -1*(d['Neutral']/2+d['Disagree'])
    	var idx = 0
    	//console.log(d, x0, idx)
    	//console.log('------------map---------------')
    	d.boxes = color.domain().map(function(name) {
    		return {
    			name: name,
    			x0: x0,
    			x1: x0 += d[name],
    			N: sum,
    			n: +d['c'+ (idx += 1)]
    		}
    	})
    	console.log(d)
    })

    var min = d3.min(data, d => d.boxes['0'].x0 )
    var max = d3.max(data, d => d.boxes['2'].x1 )

    xscale.domain([min, max]).nice()
    yscale.domain(data.map(d => [d[x], d['filter_id']]))

    g.append("g")
    	.attr("class", "x axis")
    	.call(xAxis)

    g.append("g")
    	.attr("class", "y axis")
    	.call(yAxis)

    	console.log(data)

    var vakken = g.selectAll(".items")
    		.data(data)
    	.enter().append("g")
    		.attr("class","bar")
    		.attr("transform", d => "translate(0,"+yscale(d[x])+")")

    var bars = vakken.selectAll("rect")
    		.data(d => d.boxes)
    	.enter().append("g")
    		.attr("class", "subbar")

    bars.append("rect")
    	.attr("height", yscale.range())
    	.attr("x", d => xscale(d.x0))
    	.attr("width", d => (xscale(d.x1)-xscale(d.x0)) )
    	.attr("fill", "red")

    bars.append("text")
    	.attr("x", d => xscale(d.x0))
    	.attr("y", yscale.range()/2)
    	.attr("dy", "0.5em")
    	.attr("dx", "0.5em")
    	.style("font", "10px sans-serif")
    	.style("text-anchor", "begin")
    	.text( function(d) { return d.n !== 0 && (d.x1-d.x0)>3 ? d.n : "" } )

    vakken.insert("rect", ":first-child")
    	.attr("height", yscale.range())
    	.attr("x", "1")
    	.attr("width", width)
    	.attr("fill-opacity", "0.5")
    	.style("fill", "red")
    	.attr("class", (d,i) => i%2==0 ? "even" : "uneven" )

    g.append("g")
    		.attr("class", "y axis")
    	.append("line")
    		.attr("x1", xscale(0))
    		.attr("x2", xscale(0))
    		.attr("y2", height)*/

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
    		<svg className={this.props.selector} width="600" height="400"> </svg>
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
