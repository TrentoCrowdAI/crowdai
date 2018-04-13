import React from 'react'
import { connect } from 'react-redux'
import * as d3 from 'd3'
import PropTypes from 'prop-types'
import Math from 'math'

import NestChart from './NestChart'
import ChartWrapper from './ChartWrapper'

class Histogram extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked: []
    }
    this.buildGraph = this.buildGraph.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  buildGraph() {
    //console.log(this.props.data)
    var svg = d3.select("."+this.props.selector);
    var x = this.props.x
    var y = this.props.y

    var data = this.props.data.sort( function(a,b) {
      return (a[x] > b[x]) ? 1 : ((b[x] > a[x]) ? -1 : 0);
    })

    var margin = {top: 30, right: 30, bottom: 30, left: 30};
    var width = +svg.attr("width") - margin.left - margin.right;
    var height = +svg.attr("height") - margin.top - margin.bottom;
    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var color = this.props.color

    var xscale = d3.scaleLinear()
        .range([0, width])
        .domain([d3.min(data, d => Math.floor(d[x]/10)*10), d3.max(data, d => Math.round((d[x]+4)/10)*10)])
    var xAxis = d3.axisBottom(xscale);

    var histo = d3.histogram()
        //.domain(d3.extent(data, d => d[x]))
        .thresholds(xscale.ticks(10))
        (data.map(d => d[x]));

    var yscale = d3.scaleLinear()
      .domain([0, d3.max(histo, d => d.length)])
      .range([height,0])
    var yAxis = d3.axisLeft(yscale);

    var bar = g.selectAll(".bar")
        .data(histo)
        .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function(d) {
          //console.log(d.x0,d.x1,d.length)
          return "translate(" + xscale(d.x0) + "," + yscale(d.length) + ")";
        })

    bar.append("rect")
          .style("fill", color)
          .attr("x", 1)
          .attr("width", d => xscale(d.x1)-xscale(d.x0)-1 )
          .attr("height", d => height-yscale(d.length) )
          .on("mouseover", function() {
            d3.select(this).style("opacity","0.8")
          })
          .on("mouseout", function() {
            d3.select(this).style("opacity","1")
          })
          .on("click", (d) => {
            this.setState({
              clicked : []
            })

            //console.log(d.x0,d.x1,d.length)
            var nuovo = []
            data.map( (step,i) => {
              if((step[x]>=d.x0 && step[x]<d.x1) || (step[x]>=d.x0 && step[x]==d.x1)) {
                nuovo = nuovo.concat([step])
              }
            })
            this.handleClick(nuovo)
          })
          .transition().duration(700).attr("height", d => height-yscale(d.length))

    bar.append("text")
          .attr("dy", ".75em")
          .attr("y", d => 10)
          .attr("x", d => (xscale(d.x1)-xscale(d.x0))/2 )
          .attr("text-anchor", "middle")
          .style("fill", "white")
          .text( d => d.length ? d.length : null)

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

  handleClick(d) {
    this.setState({
      clicked: d
    })
  }

  render() {

    var stampa = this.state.clicked.map(d => <li key={d[this.props.y]}>{this.props.y+" "+d[this.props.y]+" => "+this.props.x+" "+d[this.props.x]}</li>)
    
    return (
      <div>
        <br />
        <svg className={this.props.selector} width="700" height="400"> </svg>
        <br />
        <strong>Clicked data:</strong> <ul>{stampa}</ul>
        {
          this.state.clicked.length ?
            <ChartWrapper 
              color="orange"
              x={this.props.y}
              y={this.props.x}
              chart='nest'
              selector={'nestedchart'}
              data={this.state.clicked}
              /> : ''
        }
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
