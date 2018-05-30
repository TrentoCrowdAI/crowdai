import React from 'react'
import { connect } from 'react-redux'
import * as d3 from 'd3'
import PropTypes from 'prop-types'
import Math from 'math'

class HeatMap extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
      clicked: [],
      //chosencriteria: 'all',
      data: this.props.data
    }
    this.buildGraph = this.buildGraph.bind(this);
    this.dataWrapper = this.dataWrapper.bind(this);
	}

	dataWrapper() {
    if(this.props.data.length==0) {
      
      var svg = d3.select("."+this.props.selector)
      var margin = {top: 30, right: 30, bottom: 30, left: 30};
      var g = svg.append("g")

      g.append("text")
        .text("Choose a worker")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    } else {
      this.buildGraph()
    }
  }

	buildGraph() {
		var svg = d3.select("."+this.props.selector);

    var margin = {top: 30, right: 30, bottom: 30, left: 30};
    var width = +svg.attr("width") - margin.left - margin.right;
    var height = +svg.attr("height") - margin.top - margin.bottom;
    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var x = this.props.x //worker_a
    var y = this.props.y //worker_b
    var z = this.props.z //cohen_K

    function mean(arr) {
      return arr.reduce((acc,prev) => acc+prev)/arr.length
    }

    /*var data = this.props.data.sort( function(a,b) {
      return (a[x] > b[x]) ? 1 : ((b[x] > a[x]) ? -1 : 0);
    })*/
    var xelems = Array.from(new Set(this.props.data.map(d => d[x]))).sort(function(a,b) {
      return (a > b) ? 1 : ((b > a) ? -1 : 0);
    })
    var yelems = Array.from(new Set(this.props.data.map(d => d[y]))).sort();
    var colors = ['#FFE5CC', '#FFCC99', '#FFB266', '#FF9933', '#FF8000', '#CC6600']
    console.log('xelems', xelems)
    console.log('yelems', yelems)

    var xscale = d3.scaleBand()
        .domain(xelems)
        .range([0,xelems.length*22])
        .paddingInner(20).paddingOuter(9)
    
    var xAxis = d3.axisBottom()
        .scale(xscale)
        .tickFormat("")
    
    var yscale = d3.scaleBand()
        .domain(yelems)
        .range([0, yelems.length*22])
        .paddingInner(.2).paddingOuter(.2)

    var yAxis = d3.axisLeft()
        .scale(yscale)
        .tickFormat("")

    var colorScale = d3.scaleQuantile()
        .domain([-0.25,0,0.25,0.5,0.75,1])
        .range(colors)

    var tooltip = d3.select('body')
        .append('div')
        .style('width','240px')
        .style('height','80px')
        .style('background','steelblue')
        .style('opacity','1')
        .style('position','absolute')
        .style('visibility','hidden')
        .style('padding','10px')
        .style('box-shadow','0px 0px 6px #7861A5')

    var toolval = tooltip.append('div')

    var cells = g.selectAll('rect')
        .data(this.props.data)
        .enter().append('g').append('rect')
        .attr('class', 'cell')
        .attr('width', 20)
        .attr('height', 20)
        .attr('y', d => yscale(d[y]))
        .attr('x', d => xscale(d[x])-9)
        .attr('fill', d => d[z]==0 ? 'lightgreen' : colorScale(d[z]))
        .attr('rx', 3)
        .attr('ry', 3)
        .on("mouseover", function(d) {
    			//d3.select(this).style("opacity","0.8")
    			/*g.selectAll(".xaxis").selectAll("text").filter( function(text) {
    				return text === d[x] })
            .transition().duration(100).style('font','15px arial').attr('font-weight', 'bold')
          g.selectAll(".yaxis").selectAll("text").filter( function(text) {
            return text === d[y] })
            .transition().duration(100).style('font','15px arial').attr('font-weight', 'bold')*/
    		})
    		.on("mouseout", function(d) {
          //d3.select(this).style("opacity","1")
          tooltip.style('visibility', 'hidden')
    			/*g.selectAll(".xaxis").selectAll("text").filter( function(text) {
    				return text === d[x] })
            .transition().style('font','10px arial').attr('font-weight', 'normal')
          g.selectAll(".yaxis").selectAll("text").filter( function(text) {
            return text === d[y] })
            .transition().style('font','10px arial').attr('font-weight', 'normal')*/
        })
        .on("mousemove", d => {
          tooltip.style('visibility', 'visible')
              .style('top',(d3.event.pageY-30)+'px')
              .style('left',(d3.event.pageX-260)+'px')
          tooltip.select('div')
              .html('worker A: <b>'+d[x].toUpperCase()+'</b>,'+
                  '<br />Worker B: <b>'+d[y].toUpperCase()+'</b>,'+
                  '<br />Cohen\'s Kappa => <b>'+d[z].toFixed(5)+'</b>')
        })

    g.append('g')
        .attr('class', 'xaxis')
        .attr('transform', 'translate(0,'+(yelems.length*22+9)+')')
        .call(xAxis)
        /*.selectAll('text')
        .attr('font-weight', 'normal')
        .style('text-anchor', 'end')
        .style('font', '10px arial')
        .attr('dx', '-.8em')
        .attr('dy', '-.5em')
        .attr('transform', d => 'rotate(-65)')*/

    g.append('g')
        .attr('class', 'yaxis')
        .call(yAxis)
        /*.selectAll('text')
        .attr('font-weight', 'normal')
        .style('font', '10px arial')*/




	}

	componentDidMount() {
		this.dataWrapper();
	}

	componentDidUpdate() {
		d3.select("."+this.props.selector).selectAll("g").remove();
		this.dataWrapper();
	}

	render() {
		return(
			<div>
			- HeatMap -
			<br />
			<svg className={this.props.selector} height='1000' width='1000'> </svg>
			</div>
		);
	}
}

const mapStateToProps = state => ({

})

const mapDispatchToProps = dispatch => ({

})

export default connect (mapStateToProps,mapDispatchToProps)(HeatMap)
