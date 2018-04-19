import React from 'react'
import PropTypes from 'prop-types'
import * as d3 from 'd3'
import {connect} from 'react-redux'

class SimpleLineChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked: []
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
        .text("Choose a ...")
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
    var color = this.props.color

    var x = this.props.x
    var y = this.props.y
    
    var data = this.props.data.sort( function(a,b) {
      return (a[x] > b[x]) ? 1 : ((b[x] > a[x]) ? -1 : 0);
    })
    
    var xscale = d3.scaleLinear()
        .domain(d3.extent(data, d => d[x] ))
        .range([0, width]);
    var xAxis = d3.axisBottom(xscale);

    var yscale = d3.scaleLinear()
        .domain(d3.extent(data, d => d[y] ))
        .range([height, 0]);
    var yAxis = d3.axisLeft(yscale);

    g.append("g")
       .attr("class","x axis")
       .attr("transform","translate(0,"+height+")")
       .call(xAxis)
       .append("text")
          .attr("fill","black")
          .attr("transform","translate("+(width-10)+",0)")
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
          .text(this.props.y);

    //deploy data to be dispalyed on a line
    var line = d3.line()
        .x( (d) => {return xscale(d[x])} )
        .y( (d) => {return yscale(d[y])} )
        .curve(d3.curveMonotoneX);

    g.append("path")
      .datum(data)
      .attr("class","original")
      .attr("d", line)
      .style("stroke", color)
      .style("fill","none")
      .style("stroke-width",2)

    g.selectAll(".dot")
      .data(data).enter()
        .append("circle")
        .style("fill", color)
        .attr("class","dot")
        .attr("cx", d => xscale(d[x]) )
        .attr("cy", d => yscale(d[y]) )
        .attr("r",5)
        .on("click", (d) => {
          this.setState({
            clicked: []
          })
          data.map(step => {
            if(step[x] === d[x] && step[y] === d[y]) {
              var nuovo = this.state.clicked.concat([
                this.props.x+" : "+d[x]+",   "+this.props.y+" : "+d[y]
                ])
              this.setState({
                clicked: nuovo
              })
            }
          })
        })
        
        //drag modifying data
        /*.call(d3.drag()
          .on("drag", function(d) {
            d[x] = Math.round(xscale.invert(d3.event.x))
            d[y] = Math.round(yscale.invert(d3.event.y))
            //console.log(d)

            d3.select(this)
            .attr("cx",xscale(d[x]))
            .attr("cy",yscale(d[y]))

            g.select(".line").remove()

            g.append("path")
              .datum(data)
              .attr("class","line")
              .attr("d", line)
              .style("stroke", "dark"+color)
              .style("fill","none")
              .style("stroke-width",2)
          })
          .on("end", function() {

            g.selectAll(".line").remove()

            data.sort( function(a,b) {
              return (a[x] > b[x]) ? 1 : ((b[x] > a[x]) ? -1 : 0);
            })

            g.append("path")
              .datum(data)
              .attr("class","line")
              .attr("d", line)
              .style("stroke", "dark"+color)
              .style("fill","none")
              .style("stroke-width",2)
          })
        )*/
        .on("mouseover", function() {
          d3.select(this)
          .style("opacity", "0.5")
        })
        .on("mouseout", function() {
          d3.select(this)
          .style("opacity","1")
        })

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
        <svg className={this.props.selector} width="800" height="400"> </svg>
        <br />
        <strong>Clicked data:</strong> {this.state.clicked}
      </div>
    )
  }
}

SimpleLineChart.propTypes = {

}

const mapStateToProps = state => ({

})

const mapDispatchToProps = dispatch => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(SimpleLineChart);
