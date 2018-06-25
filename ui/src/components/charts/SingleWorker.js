import React from 'react'
import { connect } from 'react-redux'
import * as d3 from 'd3'
import PropTypes from 'prop-types'
import ChartWrapper from './ChartWrapper'
import '../admin/reports/reports.css'
import { actions } from '../admin/reports/actions'
import Math from 'math'

class SingleWorker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      order: this.props.x,
      data: []
    }
    this.dataWrapper = this.dataWrapper.bind(this)
    this.buildGraph = this.buildGraph.bind(this);
  }

  dataWrapper() {
    /*if(this.props.data.length==0) {
      var svg = d3.select("."+this.props.selector)
      var margin = {top: 30, right: 30, bottom: 30, left: 30};
      var g = svg.append("g")

      g.append("text")
        .text("Choose a worker")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    } else {*/
      this.buildGraph()
    //}
  }

  buildGraph() {
    //var data = this.props.data
    var svg = d3.select("."+this.props.selector)

    var x = this.props.x
    var y = this.props.y
    var z = this.props.z
    var w = this.props.w
    var param = this.props.param

    var margin = {top: 10, right: 30, bottom: 90, left: 40};
    var width = +svg.attr("width") - margin.left - margin.right;
    var height = +svg.attr("height") - margin.top - margin.bottom;
    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var color = 'orange'
  }

  componentDidMount() {
    this.dataWrapper();
  }

  componentDidUpdate() {
    d3.select("."+this.props.selector).selectAll("g").remove();
    this.dataWrapper();
  }

  render() {
    console.log(this.props)
    return (
      <div className='nest'>
        <div className='rowC'>
        <ChartWrapper 
          chart={'pie'}
          x={'turk_id'}
          y={'answer'}
          z={['item_id','criteria_id']}
          param={this.props.w.chosencriteria}
          selector={'chart_crowd'}
				  data={Object.values(this.props.param.reports.tasks)}
        />
        <ChartWrapper 
          chart={'pie'}
          x={'turk_id'}
          y={'answer'}
          z={['item_id','criteria_id']}
          param={this.props.w.chosencriteria}
          selector={'chart_gold'}
				  data={Object.values(this.props.param.reports.tasks)}
        />
        </div>
        <svg className={this.props.selector} width="1000" height="800"> </svg>
      </div>
    );
  }
}

SingleWorker.propTypes = {
}

const mapStateToProps = state => ({
})

const mapDispatchToProps = dispatch => ({
})

export default connect (mapStateToProps,mapDispatchToProps)(SingleWorker)
