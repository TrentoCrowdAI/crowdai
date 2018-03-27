import React from 'react'
import { connect } from 'react-redux'
import * as d3 from 'd3'
import PropTypes from 'prop-types'
import Math from 'math'

class NestChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data.sort( (a,b) =>
        (a[this.props.x] > b[this.props.x]) ? 1 : ((b[this.props.x] > a[this.props.x]) ? -1 : 0)),
      clicked: []
    }
    this.buildGraph = this.buildGraph.bind(this);
  }

  buildGraph() {
    var svg = d3.select("."+this.props.selector);
    var x = this.props.x
    var y = this.props.y

    var data = this.state.data

    var sum = 0
    data.map(step => {
      sum += step[y]
    })
    var media = sum/data.length
    //console.log(media)

    var margin = {top: 30, right: 30, bottom: 30, left: 30};
    var width = +svg.attr("width") - margin.left - margin.right;
    var height = +svg.attr("height") - margin.top - margin.bottom;
    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var color = "steelblue" //this.props.color

    var yscale = d3.scaleLinear()
        .rangeRound([height, 0])
        .domain([0, d3.max(data, d => d[y])])

    var xscale = d3.scaleBand()
        .rangeRound([0, width])
        .padding(0.1)
        .domain(data.map(d => d[x]))

    var xAxis = d3.axisBottom(xscale)

    var yAxis = d3.axisLeft(yscale)
        .ticks(10)

    var bar = g.selectAll(".bar")
        .data(data)
        .enter().append("g")
          .attr("class","bar")
          
    bar.append("rect")
        .style("fill", d => {
          if(d[y]>media) return color
            else return "green"
        })
        .attr("x", d => xscale(d[x]))
        .attr("y", d => yscale(d[y]))
        .attr("width", xscale.bandwidth())
        .attr("height", d => height-yscale(d[y]))

    bar.append("text")
        .attr("dy", ".75em")
        .attr("y", d => yscale(d[y])+10 )
        .attr("x", d => xscale(d[x])+(xscale.bandwidth()/2) )
        .attr("text-anchor", "middle")
        .style("fill", "white")
        .text( d => d[y])

    var line = d3.line()
        .x( (d) => {return xscale(d[x])} )
        .y( (d) => {return yscale(d[y])} )

    g.append("path")
        .datum([{
          total_time : media,
          task_id : data[0][x]
        },{
          total_time : media,
          task_id : data[data.length-1][x]
        }])
        .attr("class","original")
        .attr("transform","translate("+(xscale.bandwidth()/2)+",0)")
        .attr("d", line)
        .style("stroke", "red")
        .style("fill","none")
        .style("stroke-width",1)

    g.append("g")
        .attr("class","axis axis--x")
        .attr("transform","translate(0,"+height+")")
        .call(xAxis)
        .append("text")
          .attr("fill","black")
          .attr("transform","translate("+(width-15)+",0)")
          .attr("dy","-1em")
          .text(this.props.x)

    g.append("g")
        .attr("class","axis axis--y")
        .call(yAxis)
        .append("text")
          .attr("fill","black")
          .attr("transform","rotate(-90)")
          .attr("text-anchor","end")
          .attr("dy","2em")
          .text(this.props.y)

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
        <br />
        <strong>Clicked data:</strong> <ul></ul>
        <br />

        <button
          onClick={(event) => this.setState({
            data: this.props.data.sort( (a,b) =>
              (a[this.props.y] > b[this.props.y]) ? 1 : ((b[this.props.y] > a[this.props.y]) ? -1 : 0))
          })}
        ><strong>Sort y</strong></button>
        <button
          onClick={(event) => this.setState({
            data: this.props.data.sort( (a,b) =>
              (a[this.props.x] > b[this.props.x]) ? 1 : ((b[this.props.x] > a[this.props.x]) ? -1 : 0))
          })}
        ><strong>Sort x</strong></button>
        <hr />

        <button>Total Time statistics</button>
        <button>Average Time statistics</button>
        <button>Standard Time statistics</button>
      </div>
    );
  }
}

NestChart.propTypes = {

}

const mapStateToProps = state => ({

})

const mapDispatchToProps = dispatch => ({

})

export default connect (mapStateToProps,mapDispatchToProps)(NestChart)
