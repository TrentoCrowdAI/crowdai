import React from 'react'
import PropTypes from 'prop-types'
import * as d3 from 'd3'
import {connect} from 'react-redux'

class LineMetricChart extends React.Component {
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
      var margin = {top: 10, right: 30, bottom: 30, left: 30};
      var g = svg.append("g")

      g.append("text")
        .text("Choose a Task")
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
    var z = this.props.z
        
    var data = this.props.data/*.sort( function(a,b) {
      return (Number(a[x]) > Number(b[x])) ? 1 : ((Number(b[x]) > Number(a[x])) ? -1 : 0);
    })*/
    
    var xscale = d3.scaleLinear()
        .domain( d3.extent(data, (d,i) => i) )
        .range([0, width])
    var xAxis = d3.axisBottom(xscale)
        .tickFormat(d => d[x])


    var yscale = d3.scaleLinear()
        .domain(d3.extent(data, d => d[y]))
        .range([height, 0])
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
          .text("%");

    //deploy data to be displayed on a line
    var line = d3.line()
        .x( (d,i) => { return xscale(i) } )
        .y( (d) => { return yscale( d[y] ) } )
        .curve(d3.curveMonotoneX);

    g.append("path")
      .datum(data)
      .attr("class","original")
      .attr("d", line)
      .style("stroke", 'steelblue')
      .style("fill","none")
      .style("stroke-width",2)

    g.selectAll(".dot")
      .data(data).enter()
        .append("circle")
        .style("fill", 'orange')
        .attr("class","dot")
        .attr("cx", (d,i) => xscale(i) )
        .attr("cy", d => yscale(d[y]) )
        .attr("r",4)
        .on("click", (d) => {
          this.setState({
            clicked: []
          })
          data.map(step => {
            if(step[x] === d[x] && step[y] === d[y]) {
              var nuovo = this.state.clicked.concat([step])
              this.setState({
                clicked: nuovo
              })
            }
          })
        })
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
    //console.log(this.props)
    var x = this.props.x
    var y = this.props.y
    var z = this.props.z
    return(
      <div>
        <svg className={this.props.selector} width="1000" height="400"> </svg>
        <br />
        <strong>Clicked data:</strong> {this.state.clicked.map( d =>
      z!='' ?
        <React.Fragment>
          {x+" : "}<strong style={{color: 'steelblue'}}>{d[x]}</strong>{", "}
          {y+" : "}<strong style={{color: 'steelblue'}}>{d[z[0]]+"/"+d[z[1]]}</strong>{" = "}
          <strong style={{color: 'steelblue'}}>{d[y]}</strong>{" %"}
        </React.Fragment>
      : <React.Fragment>
          {x+" : "}<strong style={{color: 'steelblue'}}>{d[x]}</strong>{", "}
          {y+" : "}<strong style={{color: 'steelblue'}}>{d[y]}</strong>{" %"}
        </React.Fragment>
        )}
      </div>
    )
  }
}

LineMetricChart.propTypes = {

}

const mapStateToProps = state => ({

})

const mapDispatchToProps = dispatch => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(LineMetricChart);
