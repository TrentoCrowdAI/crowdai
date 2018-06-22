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
        .text("No data retrieved")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    } else {
      this.buildGraph()
    }
  }

	buildGraph() {
	var svg = d3.select("."+this.props.selector);

    var margin = {top: 10, right: 30, bottom: 30, left: 100};
    var width = +svg.attr("width") - margin.left - margin.right;
    var height = +svg.attr("height") - margin.top - margin.bottom;
    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var x = this.props.x
    var y = this.props.y
    var z = this.props.z
    var param = this.props.param
    var data = this.props.data
    var xelems = Array.from(new Set(this.props.data.map(d => d[x])))
        //.sort((a,b) => a > b ? 1 : a < b ? -1 : 0);
    var yelems = Array.from(new Set(this.props.data.map(d => d[y])))
        //.sort((a,b) => a > b ? 1 : a < b ? -1 : 0);
    var colors = ['#FFE6CD', '#FFCD9A', '#FFB366', '#FF9A33', '#FF8000']

    var xscale = d3.scaleBand()
        .domain(xelems)
        .range([xelems.length*(width/xelems.length),0])
        .paddingInner(20).paddingOuter(7)
    
    var xAxis = d3.axisTop()
        .scale(xscale)
        .tickFormat("")
    
    var yscale = d3.scaleBand()
        .domain(yelems)
        .range([yelems.length*(width/yelems.length), 0])
        .paddingInner(.2).paddingOuter(.2)

    var yAxis = d3.axisLeft()
        .scale(yscale)
        .tickFormat(d => d.substring(0,15)+'...')

    var colorScale = d3.scaleQuantile()
        .domain([0,1])
        .range(colors)

    var tooltip = d3.select('body')
        .append('div')
        .style('width','300px')
        .style('height','110px')
        .style('background','#A7DEF2')
        .style('opacity','0.90')
        .style('position','absolute')
        .style('visibility','hidden')
        .style('padding','5px')
        .style('box-shadow','0px 0px 6px #7861A5')

    var toolval = tooltip.append('div')

    var cells = g.selectAll('rect')
        .data(this.props.data)
        .enter().append('g').append('rect')
        .attr('class', 'cell')
        .attr('width', (width/xelems.length)-1)
        .attr('height', (width/yelems.length)-1)
        .attr('y', d => yscale(d[y]))
        .attr('x', d => xscale(d[x])-7)
        .attr('fill', d => d[z]/param==0 ? 'lightgreen' : d[z]/param==1 ? 'red' : colorScale(d[z]/param))
        .attr('rx', 2)
        .attr('ry', 2)
        /*.on("mouseover", function(d) {
            g.selectAll(".yaxis").selectAll("text").filter( function(text) {
                return text === d[y] })
                .transition().duration(100).style('font','15px arial').attr('font-weight', 'bold')
    	})*/
    	.on("mouseout", () => 
            tooltip.style('visibility', 'hidden')
            /*g.selectAll(".yaxis").selectAll("text").filter( text => text === d[y] )
                .transition().style('font','10px arial').attr('font-weight', 'normal')*/
        )
        .on("mousemove", d => {
          tooltip.style('visibility', 'visible')
              .style('top',(d3.event.pageY-50)+'px')
              .style('left',(d3.event.pageX-310)+'px')
          tooltip.select('div')
              .html(x+': <b>'+d[x]+'</b>,'+
                  '<br />'+y+': <b>'+d[y]+'</b>,'+
                  '<br />'+z+' => <b>'+d[z].toFixed(2)+'</b>')
        })

    g.append('g')
        .attr('class', 'xaxis')
        .attr('transform', 'translate(0,0)')
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
        .selectAll('text')
            .attr('font-weight', 'normal')
            .style('font', '10px arial')

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
                <ul className={'legend'}>
                    <li><span style={{'background-color':'#FFE6CD'}}></span>{this.props.z} {" < 0.20"}</li>
                    <li><span style={{'background-color':'#FFCD9A'}}></span>{this.props.z} {" < 0.40"}</li>
                    <li><span style={{'background-color':'#FFB366'}}></span>{this.props.z} {" < 0.60"}</li>
                </ul>
                <br />
                <ul className={'legend'}>
                    <li><span style={{'background-color':'#FF9A33'}}></span>{this.props.z} {" < 0.80"}</li>
                    <li><span style={{'background-color':'#FF8000'}}></span>{this.props.z} {" < 1"}</li>    
                    <li><span style={{'background-color':'red'}}></span>{this.props.z} = 1</li>
                </ul>
			<br />
			<svg className={this.props.selector} height='1100' width='1000'> </svg>
			</div>
		);
	}
}

const mapStateToProps = state => ({

})

const mapDispatchToProps = dispatch => ({

})

export default connect (mapStateToProps,mapDispatchToProps)(HeatMap)
