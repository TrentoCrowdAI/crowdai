import React from 'react'
import { connect } from 'react-redux'
import * as d3 from 'd3'
import PropTypes from 'prop-types'
import Math from 'math'

class NestChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      order: this.props.x,
      clicked: []
    }
    this.dataWrapper = this.dataWrapper.bind(this)
    this.buildGraph = this.buildGraph.bind(this);
  }

  dataWrapper() {
    var order = this.state.order
    var z = this.props.z
    this.props.data.sort( function(a,b)
      {
        if (a[order]==b[order])
          return (a[z] > b[z]) ? 1 : ((b[z] > a[z]) ? -1 : 0)
        else 
          return (a[order] > b[order]) ? 1 : ((b[order] > a[order]) ? -1 : 0)
      }
    )
      
    
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
    var data = this.props.data
    var svg = d3.select("."+this.props.selector);
    var x = this.props.x
    var y = this.props.y
    var z = this.props.z

    //computing average data to display on chart
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
        .domain([0, d3.max(data, d => d[y]/1000*1.5)])

    var xscale = d3.scaleBand()
        .rangeRound([0, width])
        .padding(0.1)
        .domain(data.map(d => d[x]+","+d[z]))

    var xAxis = d3.axisBottom(xscale)
    var yAxis = d3.axisLeft(yscale).ticks(10)

    var bar = g.selectAll(".bar")
        .data(data)
        .enter().append("g")
          .attr("class","bar")
          
    bar.append("rect")
        .style("fill", d => {
          if(d[y]>=media) return color
            else return "lightgreen"
        })
        .attr("x", d => xscale(d[x]+","+d[z]))
        .attr("y", d => yscale(d[y]/1000))
        .attr("width", xscale.bandwidth())
        .attr("height", d => height-yscale(d[y]/1000))
        .on("mouseover", function() {
          d3.select(this)
            .style("opacity","0.8")
        })
        .on("mouseout", function() {
          d3.select(this)
            .style("opacity","1")
        })
        /*.on("click", function() {
            //add onClick here
        })*/
        
    bar.append("text")
        .attr("dy", ".75em")
        .attr("y", d => yscale(d[y]/1000)+10 )
        .attr("x", d => xscale(d[x]+","+d[z])+(xscale.bandwidth()/2) )
        .attr("text-anchor", "middle")
        .style("fill", "white")
        .text( d => d[y]/1000)

    var line = d3.line()
        .x( (d) => {return xscale(d[x]+","+d[z])} )
        .y( (d) => {return yscale(d[y]/1000)} )

    g.append("path")
      .datum([{
        avgtime_ms : media,
        item_id : data[0][x],
        criteria_id : data[0][z]
      },{
        avgtime_ms : media,
        item_id : data[data.length-1][x],
        criteria_id : data[data.length-1][z]
      }])
      .attr("class","average")
      .attr("transform","translate("+(xscale.bandwidth()/2)+",0)")
      .attr("d", line)
      .style("stroke", "red")
      .style("fill","none")
      .style("stroke-width",1)
    
    if(data.length>1) {
      g.append("text")
          .attr("fill", "red")
          .attr("transform", "translate("+width/2+","+yscale(media/1000)+")")
          .attr("text-anchor","middle")
          .attr("dy","-0.5em")
          .text("media ~ "+media/1000+" s")
    }

    g.append("g")
        .attr("class","axis axis--x")
        .attr("transform","translate(0,"+height+")")
        .call(xAxis)
        .append("text")
          .attr("fill","black")
          .attr("transform","translate("+(width-15)+",0)")
          .attr("dy","-1em")
          .text(this.props.x+","+this.props.z)

    g.append("g")
        .attr("class","axis axis--y")
        .call(yAxis)
        .append("text")
          .attr("fill","black")
          .attr("transform","rotate(-90)")
          .attr("text-anchor","end")
          .attr("dy","2em")
          .text("avg_time s")

  }

  componentDidMount() {
    this.dataWrapper();
  }

  componentDidUpdate() {
    d3.select("."+this.props.selector).selectAll("g").remove();
    this.dataWrapper();
  }

  render() {
    return (
      <div className='nest'>
        <svg className={this.props.selector} width="800" height="400"> </svg>
        <br />
      { this.props.data.length ? 
        <React.Fragment>
        <button
          onClick={(event) => this.setState({
              order: this.props.y
            })
          }
        ><strong>Sort y</strong></button>

        <button
          onClick={(event) => this.setState({
              order: this.props.x
            })
          }
        ><strong>Sort x</strong></button>
        </React.Fragment> : " "
      }
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
