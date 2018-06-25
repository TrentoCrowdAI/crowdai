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
    this.dataWrapper = this.dataWrapper.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  dataWrapper() {
    if(this.props.data.length==0) {
      
      var svg = d3.select("."+this.props.selector)
      var margin = {top: 30, right: 30, bottom: 30, left: 30};
      var g = svg.append("g")

      g.append("text")
        .text("Choose a job")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    } else {
      this.buildGraph()
    }
  }

  buildGraph() {
    var svg = d3.select("."+this.props.selector);
    var x = this.props.x
    var y = this.props.y
    var z = this.props.z
    var param = this.props.param

    var data = this.props.data.sort( function(a,b) {
      return (a[x] > b[x]) ? 1 : ((b[x] > a[x]) ? -1 : 0);
    })

    var margin = {top: 30, right: 30, bottom: 30, left: 30};
    var width = +svg.attr("width") - margin.left - margin.right;
    var height = +svg.attr("height") - margin.top - margin.bottom;
    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var color = 'steelblue'

    var xscale = d3.scaleLinear()
      .range([0, width])
      .domain([
        0,
        //d3.min(data, d => Math.floor((d[x]/param)/10)*10), 
        d3.max(data, d => (Math.round((d[x]/param)/10)*10)  )
      ])
    var xAxis = d3.axisBottom(xscale)
    
    var histo = d3.histogram()
      .thresholds(xscale.ticks(10))
      (data.map(d => d[x]===0 ? d[x]/param : ((d[x]/param)-1) ))

    var yscale = d3.scaleLinear()
      .domain([0, d3.max(histo, d => d.length)])
      .range([height,0])
    var yAxis = d3.axisLeft(yscale)

    var bar = g.selectAll(".bar")
      .data(histo)
      .enter().append("g")
      .attr("class", "bar")
      .attr("transform", d => "translate("+
        ( d.x0===d3.min(data, d => ((d[x]/param)-1)) ? xscale(d3.min(xscale.domain())) : xscale(d.x0) )
        +","+yscale(d.length)+")")

    bar.append("rect")
      .style("fill", color )
      .attr("x", 1)
      .attr("width", d => 
        xscale( (d3.max(xscale.domain()) / ((xscale.ticks().length)-1)) )-1
      )
      .attr("height", d => height-yscale(d.length) )
      .on("mouseover", function() {
        d3.select(this)
          .style("opacity","0.8")
      })
      .on("mouseout", function() {
        d3.select(this)
          .style("opacity","1")
      })
      .on("click", (d) => {
        this.setState({
          clicked : []
        })
        var nuovo = []
        console.log(d.x0,d.x1)
        data.map( step => (
          d.x0===d3.min(xscale.domain()) ? (step[x]/param>=d.x0 && step[x]/param<=d.x1)
          : d.x1===d3.max(xscale.domain())-1 ? (step[x]/param>d.x0)
          : (step[x]/param>d.x0 && step[x]/param<=d.x1)
        ) ? nuovo = nuovo.concat([step]) : null )

        this.handleClick(nuovo)
      })

    bar.append("text")
      .attr("dy", ".75em")
      .attr("y", d => -15)
      .attr("x", d => 
          xscale( (d3.max(xscale.domain()) / (xscale.ticks().length-1))/2 )
        )
      .attr("text-anchor", "middle")
      .style("fill", "steelblue")
      .text( d => d.length ? d.length : null)

    g.append("g")
      .attr("class","x axis")
      .attr("transform","translate(0,"+height+")")
      .call(xAxis)
      .append("text")
        .attr("fill","black")
        .attr('text-anchor', 'end')
        .attr("transform","translate("+width+",0)")
        .attr("dy","2.5em")
        .text(this.props.x)

    g.append("g")
      .attr("class","y axis")
      .call(yAxis)
      .append("text")
        .attr("fill","black")
        .attr("transform","rotate(-90)")
        .attr("text-anchor","end")
        .attr("dy","2em")
        .text("# "+this.props.y)
  }

  componentDidMount() {
    this.dataWrapper();
  }

  componentDidUpdate() {
    d3.select("."+this.props.selector).selectAll("g").remove();
    this.dataWrapper();
  }

  handleClick(d) {
    this.setState({
      clicked: d
    })
  }

  render() {
    var y = this.props.y
    var x = this.props.x
    var z = this.props.z
    var stampa = this.props.data.length>0 ? this.state.clicked.map(d => 
      <li key={d[x]+""+d[y]}>
        {y+" "}<strong style={{color: 'steelblue'}}>{d[y]}</strong>
        {", "+z+" "}<strong style={{color: 'steelblue'}}>{d[z]}</strong>
        {" => "+x+" "}<strong style={{color: 'steelblue'}}>{d[x]}</strong>
      </li>) : " "

    return (
      <div>
        <br />
        <svg className={this.props.selector} width="1000" height="500"> </svg>
        <br />
        {this.props.data.length ? <strong>Clicked data:</strong> : " "} <ul>{stampa}</ul>

        { this.props.data.length &&
          this.state.clicked.length ?
            <ChartWrapper 
              color="orange"
              x={this.props.y}
              y={this.props.x}
              z={this.props.z}
              param={1}
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
