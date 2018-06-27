import React from 'react'
import { connect } from 'react-redux'
import * as d3 from 'd3'
import { Button } from 'semantic-ui-react'
//import PropTypes from 'prop-types'
//import Math from 'math'

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
        if (a[order]==b[order] && z!='')
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
    var param = this.props.param

    //computing average data to display on chart
    var sum = 0
    data.map(step => {
      sum += step[y]
    })
    var media = sum/data.length

    var margin = {top: 10, right: 30, bottom: 80, left: 40};
    var width = +svg.attr("width") - margin.left - margin.right;
    var height = +svg.attr("height") - margin.top - margin.bottom;
    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var color = 'orange'

    var yscale = d3.scaleLinear()
        .rangeRound([height, 0])
        .domain([0, d3.max(data, d => d[y]/param*1.5)])

    var xscale = d3.scaleBand()
        .rangeRound([0, width])
        .padding(0.1)
        .domain(data.map( d => (d[z]!=undefined ? d[x]+", "+d[z] : d[x]) ))

    var xAxis = d3.axisBottom(xscale)
      .tickFormat(d => y==='completion' ? d : (d!=undefined ? d.substring(0,10)+'...' : ""))

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
      .attr("x", d => xscale(d[z]!=undefined ? d[x]+", "+d[z] : d[x]))
      .attr("y", d => yscale(d[y]/param))
      .attr("width", xscale.bandwidth())
      .attr("height", d => height-yscale(d[y]/param))
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
      //.attr("y", d => yscale(d[y]/param)+10 )
      //.attr("x", d => xscale(d[z]!=undefined ? d[x]+","+d[z] : d[x])+(xscale.bandwidth()/2) )
      .attr("text-anchor", "end")
      .style("fill", "white")
      .attr("transform", d => "translate("+(xscale(d[z]!=undefined ? d[x]+", "+d[z] : d[x])+(xscale.bandwidth()/2)-5)+","+(yscale(d[y]/param)+10)+") rotate(-90)")
      .text( d => (d[y]/param).toFixed(1))

    var line = d3.line()
      .x( (d) => {return xscale(d[z]!=undefined ? d[x]+", "+d[z] : d[x])} )
      .y( (d) => {return yscale(d[y]/param)} )

    //average red line
    /*g.append("path")
      .datum([{
        y : media,
        x : data[0][x],
        z : data[0][z]
      },{
        y : media,
        x : data[data.length-1][x],
        z : data[data.length-1][z]
      }])
      .attr("class","average")
      .attr("transform","translate("+(xscale.bandwidth()/2)+",0)")
      .attr("d", line)
      .style("stroke", "red")
      .style("fill","none")
      .style("stroke-width",1)*/
    
    if(data.length>1) {
      g.append("text")
          .attr("fill", "red")
          .attr("transform", "translate("+width/2+","+
            ( yscale( (media/param) + d3.max(yscale.domain())/10) )
            +")"
          )
          .attr("text-anchor","middle")
          .attr("dy","-0.5em")
          .attr('font-size', y==='completion' ? '11px' : '13px')
          .text("media ~ "+(media/param).toFixed(3)+" "+this.props.y)
    }

    g.append("g")
        .attr("class","axis axis--x")
        .attr("transform","translate(0,"+height+")")
        .call(xAxis)
        .selectAll("text")
          .attr("text-anchor","end")
          .attr("dx","-.8em")
          .attr("dy","-.5em")
          .attr("transform","rotate(-65)")
        .append("text")
          .attr("fill","black")
          .attr("transform","translate("+(width-15)+",0)")
          .attr("dy","2.5em")
          .text(this.props.z!='' ? this.props.x+", "+this.props.z : this.props.x)

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
    this.dataWrapper();
  }

  componentDidUpdate() {
    d3.select("."+this.props.selector).selectAll("g").remove();
    this.dataWrapper();
  }

  render() {
    return (
      <div className='nest'>
        <svg className={this.props.selector} 
          width={this.props.y==='completion' ? '700' : '1000'} 
          height={this.props.y==='completion' ? '300' : '500'}> </svg>
        <br />
      { this.props.data.length ? 
        <React.Fragment>

          <Button
            onClick={(event) => this.setState({ order: this.props.y }) }
            style={{marginBottom: '5px'}}
          >Sort {this.props.y}</Button>

          <Button
            onClick={(event) => this.setState({ order: this.props.x }) }
            style={{marginBottom: '5px'}}
          >Sort {this.props.x}</Button>

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
