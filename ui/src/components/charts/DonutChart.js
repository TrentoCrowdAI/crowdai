import React from 'react'
import { connect } from 'react-redux'
import * as d3 from 'd3'
//import PropTypes from 'prop-types'
import Math from 'math'
import './chart.css'
//import { Form, Button } from 'semantic-ui-react';
//import '../admin/reports/reports.css'

class DonutChart extends React.Component {
  constructor(props) {
    super(props);
    this.buildGraph = this.buildGraph.bind(this);
    this.dataWrapper = this.dataWrapper.bind(this);
  }

  dataWrapper() {
    if(this.props.param=='all') {
      var crit_filtered_data = this.props.data          
    } else {
      var crit_filtered_data = this.props.data.filter(d => d[this.props.z[1]]==this.props.param )
    }

    if(crit_filtered_data.length==0) {
      var svg = d3.select("."+this.props.selector)
      var margin = {top: 20, right: 30, bottom: 20, left: 50};
      var g = svg.append("g")

      g.append("text")
        .text("Choose a Worker")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    } else {
      this.buildGraph(crit_filtered_data)
    }
  }

  buildGraph() {
    var svg = d3.select("."+this.props.selector);
    var x = this.props.x
    var y = this.props.y
    var z = this.props.z
    var w = this.props.w
    var param = this.props.param
    
    var data = this.props.data
			.filter(d => param[0]==='all' && param[1]==='all' ? true 
				: param[0]!=='all' && param[1]==='all' ? d[z[0]]===param[0]
				: param[0]==='all' && param[1]!=='all' ? d[z[1]]===param[1]
				: param[0]!=='all' && param[1]!=='all' ? d[z[0]]===param[0] && d[z[1]]===param[1] 
        : false )
    
    var margin = {top: 10, right: 30, bottom: 20, left: 50};
    var width = +svg.attr('width') - margin.left - margin.right;
    var height = +svg.attr('height') - margin.top - margin.bottom;
    var g = svg.append("g")
        .attr("transform", "translate(" + width/2 + "," + height/2 + ")");
    
    var radius = Math.min(width, height)/2
    var color = this.props.color!=undefined ? d3.scaleOrdinal(this.props.color) : d3.scaleOrdinal(['lightgreen','orange'])
    var donutWidth = 35
    var arc = d3.arc()
      .innerRadius(radius-donutWidth)
      .outerRadius(radius)
      .cornerRadius(3)
      .padAngle(0.015)
    
    var categories = Array.from(new Set(data.map(d => d[y])))

    var pie = d3.pie()
      .value(function(cat) {
        return data.filter(d => d[y]==cat).length
      })
      .sort(null)

    var donut = g.selectAll('.arc')
      .data(pie(categories))
      .enter().append('g')

    var tooltip = d3.select('body')
        .append('div')
        .style('width', '250px')
        .style('height','200px')
        .style('background','#A7DEF2')
        .style('opacity','0.90')
        .style('position','absolute')
        .style('visibility','hidden')
        .style('padding','5px')
        .style('box-shadow','0px 0px 6px #7861A5')

    tooltip.append('div')

    donut.append('path')
      .attr('d',arc)
      .attr('fill', (d,i) => color(i))
      .on('mousemove', d => {
        var stampa = ""
        this.props.data.map(step => step[y]===d.data ? stampa = stampa+
          '<li>'+z[0]+' '+step[z[0]]+', '+z[1]+' '+step[z[1]]+'</li>'
          : "")
        tooltip.style('visibility', 'visible')
          .style('height', (40+(d.value*25))+'px')
          .style('top',(d3.event.pageY-70)+'px')
          .style('left',(d3.event.pageX-270)+'px')
        tooltip.select('div')
          .html('<strong>'+d.data.toString().toUpperCase()+'</strong> answers:'+
            '<ul>'+stampa+'</ul>')
      })
      .on('mouseout', () => {
        tooltip.style('visibility','hidden')
      })
        
    donut.append('text')
      .attr("transform", d => "translate("+arc.centroid(d)+")")
      .attr("fill", "black")
      .style('font-weight','bold')
      .text(d => d.data+", "+d.value)
      .attr('text-anchor','middle')
      .attr('dy','.50em')

  }

  componentDidMount() {
    this.buildGraph();
  }

  componentDidUpdate() {
    d3.select("."+this.props.selector).selectAll("g").remove();
    this.buildGraph();
  }

  render() {
    var y = this.props.y
    var x = this.props.x
    var z = this.props.z
    return (
      <div>
        <br />
        <svg className={this.props.selector} width="200" height="200"> </svg>
      </div>
    );
  }
}

DonutChart.propTypes = {

}

const mapStateToProps = state => ({

})

const mapDispatchToProps = dispatch => ({

})

export default connect (mapStateToProps,mapDispatchToProps)(DonutChart)
