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
          return (Number(a[order]) > Number(b[order])) ? 1 : ((Number(b[order]) > Number(a[order])) ? -1 : 0)
      }
    )
    
    if(this.props.data.length==0) {
      var svg = d3.select("."+this.props.selector)
      var margin = {top: 10, right: 30, bottom: 80, left: 40};
      var g = svg.append("g")

      g.append("text")
        .text("Choose a Worker")
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
    var w = this.props.w
    var s = this.props.selector
    var param = this.props.param

    //fill color based on specifiec parameter for selecting categories
    var color = w==='correct' ? 
      this.props.color!=undefined ? d3.scaleOrdinal(this.props.color) : d3.scaleOrdinal(['lightgreen','orange','#2185d0'])
      :  'orange'

    //computing average value of the parameter to display on chart
    var sum = 0
    data.map(step => {
      sum += step[y]
    })
    var media = sum/data.length
    
    //choose fill color based on categories of answers, if specified
    var categories = Array.from(new Set(data.map(d => d[w])))

    var margin = {top: 10, right: 30, bottom: 80, left: 40};
    var width = +svg.attr("width") - margin.left - margin.right;
    var height = +svg.attr("height") - margin.top - margin.bottom;
    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var yscale = d3.scaleLinear()
        .rangeRound([height, 0])
        .domain([0, d3.max(data, d => d[y]/param*1.5)])

    var xscale = d3.scaleBand()
        .rangeRound([0, width])
        .padding(0.1)
        .domain(data.map( d => (d[z]!=undefined ? d[x]+", "+d[z] : d[x]) ))

    var xAxis = d3.axisBottom(xscale)
      .tickFormat(d => s==='wcompletion_chart' ? d : (d!=undefined ? d.substring(0,10)+'...' : ""))

    var yAxis = d3.axisLeft(yscale)
      .ticks(10)

    //append a canvas for each data element
    var bar = g.selectAll(".bar")
      .data(data)
      .enter().append("g")
        .attr("class","bar")
    
    //choose to change fil color on categories or on average value
    bar.append("rect")
      .style("fill", d => 
        {
          if(w==='correct') {return color(categories.indexOf(d[w]))}
          else if(d[y]>=media) {return color}
          else {return "lightgreen"}
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
      .attr('font-size','13px')
      .attr("text-anchor", "start")
      .style('font-weight','bold')
      .style("fill", d => 
        {
          if(w==='correct') {return color(categories.indexOf(d[w]))}
          else if(d[y]>=media) {return color}
          else {return "lightgreen"}
        })
      .attr("transform", d => "translate("+(
          xscale( d[z]!=undefined ? d[x]+", "+d[z] : d[x] )
          +((xscale.bandwidth()/2)+5)
        )+","+(yscale(d[y]/param)-10)+") rotate(-65)")
      .text( d => (d[y]/param).toFixed(1))
  
    //if average can be computed, append average value to canvas
    if(data.length>1) {
      g.append("text")
          .attr("fill", "red")
          .attr("transform", "translate("+width/2+","+10+")")
          .attr("text-anchor","middle")
          .attr('font-weight', 'bold')
          .attr("dy","-0.5em")
          .attr('font-size', s==='wcompletion_chart' ? '11px' : '13px')
          .text("average ~ "+(media/param).toFixed(3)+" "+this.props.y)
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
    var x = this.props.x
    var y = this.props.y
    var s = this.props.selector

    //buttons to sort data on 2 parameters
    return (
      <div className='nest'>
        <svg className={this.props.selector} 
          width={s==='wcompletion_chart' ? '700' : '900'} 
          height={'400'}//s==='wcompletion_chart' ? '400' : '400'}
        > 
        </svg>
        <br />
      { this.props.data.length ? 
        <React.Fragment>

          <Button
            onClick={(event) => this.setState({ order: y }) }
            style={{marginBottom: '5px'}}
          >Sort {y}</Button>

          <Button
            onClick={(event) => this.setState({ order: x }) }
            style={{marginBottom: '5px'}}
          >Sort {x}</Button>

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
