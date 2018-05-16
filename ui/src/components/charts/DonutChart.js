import React from 'react'
import { connect } from 'react-redux'
import * as d3 from 'd3'
import PropTypes from 'prop-types'
import Math from 'math'
import './chart.css'
import { Form, Button } from 'semantic-ui-react';

class DonutChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked: [],
      chosencriteria: 'all',
      data: this.props.data
    }
    this.buildGraph = this.buildGraph.bind(this);
    this.dataWrapper = this.dataWrapper.bind(this);
    this.chooseCriteria = this.chooseCriteria.bind(this);
  }

  dataWrapper() {
    if(this.state.chosencriteria=='all') {
      var crit_filtered_data = this.props.data          
    } else {
      var crit_filtered_data = this.props.data.filter(d => d[this.props.z]==this.state.chosencriteria )
    }

    if(crit_filtered_data.length==0) {
      var svg = d3.select("."+this.props.selector)
      var margin = {top: 30, right: 30, bottom: 30, left: 30};
      var g = svg.append("g")

      g.append("text")
        .text("Choose a worker")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    } else {
      this.buildGraph(crit_filtered_data)
    }
  }

  chooseCriteria(e) {
    console.log(e.target.value)
    this.setState({
      ...this.state,
      chosencriteria: e.target.value
    })
  }

  buildGraph(crit_filtered_data) {
    var svg = d3.select("."+this.props.selector);
    var x = this.props.x
    var y = this.props.y
    var z = this.props.z
    
    var data = crit_filtered_data//this.props.data

    var margin = {top: 30, right: 30, bottom: 30, left: 30};
    var width = +svg.attr('width') - margin.left - margin.right;
    var height = +svg.attr('height') - margin.top - margin.bottom;
    var g = svg.append("g")
        .attr("transform", "translate(" + width/2 + "," + height/2 + ")");
    
    var radius = Math.min(width, height)/2
    var color = d3.scaleOrdinal(['lightgreen','orange','steelblue'])
    var donutWidth = 70
    var arc = d3.arc()
      .innerRadius(radius-donutWidth)
      .outerRadius(radius)
      .cornerRadius(3)
      .padAngle(0.015)
    
    //define categories to display dinamically
    var categories = Array.from(new Set(data.map(d => d[y])))

    var pie = d3.pie()
      .value(function(cat) {
        return data.filter(d => d[y]==cat).length
      })
      .sort(null)

    var donut = g.selectAll('.arc')
      .data(pie(categories))
      .enter().append('g')

    donut.append('path')
      .attr('d',arc)
      .attr('fill', (d,i) => color(i))
      .on("mouseover", function() {
        d3.select(this).style("opacity", "0.8")
      })
      .on("mouseout", function() {
        d3.select(this).style("opacity", "1")
      })
      .on("click", d => {
        this.setState({
          clicked : []
        })
        var nuovo = []
        data.map( step => {
          console.log(d,d.data)
          if(step[y]==d.data && (this.state.chosencriteria=='all' ? true : (step[z]==this.state.chosencriteria))) {
            nuovo = nuovo.concat([step])
          }
        })
        this.handleClick(nuovo)
      })
        
    donut.append('text')
      .attr("transform", d => "translate("+arc.centroid(d)+")")
      .attr("fill", "white")
      .text(d => d.data+', '+d.value)
      .attr('text-anchor','middle')
      .attr('dy','.50em')

    //text in the middle of donut
    /*donut.append('text')
      .attr("text-anchor", "middle")
		  .attr('font-size', '4em')
		  .attr('y', 20)
	    .text('...');*/
  }

  handleClick(d) {
    this.setState({
      clicked: d
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
    var y = this.props.y
    var x = this.props.x
    var stampa = this.props.data.length>0 ?
      this.state.clicked.map(d => <li key={d[x]}>{'item_id'+" "+d.item_id}</li>) : " "
    return (
      <div>
        <br />
        <Form.Select 
          label="Select Criteria  "
          value={this.props.chosencriteria}
          options={[
            { text: 'All criteria', value: 'all'},
            { text: 'Criteria 1', value: '1'},
            { text: 'Criteria 2', value: '2'},
            { text: 'Criteria 3', value: '3'},
            { text: 'Criteria 4', value: '4'},
          ]}
          onChange={(e,{value}) => this.setState({
            ...this.state,
            chosencriteria: value
          })}
        />
        <br />
      <svg className={this.props.selector} width="1000" height="400"> </svg>  
      <br />
      { this.props.data.length ? 
        <React.Fragment>
          <strong>Clicked Data:</strong> 
        </React.Fragment>
        : " "
      } <ul>{stampa}</ul>
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
