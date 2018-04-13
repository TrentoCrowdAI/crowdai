import React from 'react'
import { connect } from 'react-redux'
import * as d3 from 'd3'
import PropTypes from 'prop-types'
import Math from 'math'

class NestChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data : this.props.data
    }
    this.buildGraph = this.buildGraph.bind(this);
  }

  dataWrapper() {
    var data = this.state.data
    console.log(data)
    //switch(this.props.choice) {
      //case 'w':
        //if(this.props.choice_id=='all') {
          if(this.props.data.length<1) {
          var svg = d3.select("."+this.props.selector)

          //no perchè modifica definitivamente l'svg
          /*svg.attr("width",700)
             .attr("height",50)*/
          //d3.select(".nest").selectAll("button").remove()

          var margin = {top: 30, right: 30, bottom: 30, left: 30};
          var g = svg.append("g")
          g.append("text")
            .text("Choose a worker")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        } else {
          this.buildGraph(data)
        }
/*        break;

      default:
        this.buildGraph(data)
        break;
    }*/
  }

  buildGraph(ndata) {
    var svg = d3.select("."+this.props.selector);
    var x = this.props.x
    var y = this.props.y
    var z = this.props.z

    var data = ndata

    var sum = 0
    data.map(step => {
      sum += step[y]
    })
    var media = sum/data.length

    var margin = {top: 30, right: 30, bottom: 30, left: 30};
    var width = +svg.attr("width") - margin.left - margin.right;
    var height = +svg.attr("height") - margin.top - margin.bottom;
    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var color = this.props.color

    var yscale = d3.scaleLinear()
        .rangeRound([height, 0])
        .domain([0, d3.max(data, d => d[y]*1.5)])

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
          if(d[y]>=media) return color
            else return "lightgreen"
        })
        .attr("x", d => xscale(d[x]))
        .attr("y", d => yscale(d[y]))
        .attr("width", xscale.bandwidth())
        .attr("height", d => height-yscale(d[y]))
        .on("mouseover", function() {
          d3.select(this)
            .style("opacity","0.8")
        })
        .on("mouseout", function() {
          d3.select(this)
            .style("opacity","1")
        })

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
    /*this.state.data.sort( (a,b) =>
        (a[this.props.x] > b[this.props.x]) ? 1 : ((b[this.props.x] > a[this.props.x]) ? -1 : 0))*/
    this.dataWrapper();
  }

  componentDidUpdate() {
    d3.select("."+this.props.selector).selectAll("g").remove();
    this.dataWrapper();
  }

  render() {
    //console.log(this.props)
    //console.log(this.state)
    return (
      <div className='nest'>
        <svg className={this.props.selector} width="700" height="400"> </svg>
        <br />
        <button
          onClick={(event) => this.setState({
            data: this.state.data.sort( (a,b) =>
               (a[this.props.y] > b[this.props.y]) ? 1 : ((b[this.props.y] > a[this.props.y]) ? -1 : 0))
          })
          }
        ><strong>Sort y</strong></button>

        <button
          onClick={(event) => this.setState({
            data: this.state.data.sort( (a,b) =>
              (a[this.props.x] > b[this.props.x]) ? 1 : ((b[this.props.x] > a[this.props.x]) ? -1 : 0))
          })
          }
        ><strong>Sort x</strong></button>
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
