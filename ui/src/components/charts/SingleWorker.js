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
    if(this.props.z==undefined) {
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
    //var data = this.props.data
    var svg = d3.select("."+this.props.selector)

    var x = this.props.x
    var y = this.props.y
    var z = this.props.z
    var w = this.props.w
    var param = this.props.param

    var margin = {top: 30, right: 30, bottom: 30, left: 5};
    var width = +svg.attr("width") - margin.left - margin.right;
    var height = +svg.attr("height") - margin.top - margin.bottom;
    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var color = 'orange'
  }

  componentDidMount() {
    //this.dataWrapper();
  }

  componentDidUpdate() {
    //d3.select("."+this.props.selector).selectAll("g").remove();
    //this.dataWrapper();
  }

  render() {
    var x = this.props.x
    var y = this.props.y
    var z = this.props.z
    var w = this.props.w
    var param = this.props.param
    console.log(this.props)
    return (
      <div className='nest'>
        <br />
        <div className='row'>
        {z ? 
            <React.Fragment>
              <strong style={{'color': 'steelblue', 'font-size': '20px'}}>{'Worker:   '}</strong>
              <strong style={{'color': 'steelblue', 'font-size': '30px'}}>{z['worker A']}</strong>
              <br />
              Worker ID: <span style={{'color': 'steelblue'}}>{z['id']}</span>
            </React.Fragment>
          : "" }
        </div>
        <div className='rowC'>

          <div style={{'width': '70%'}}>
          <br />
          <br />
          <ChartWrapper  
            chart={'timeline'}
            x={'item_id'}
            y={'delivery'}
            z={'criteria_id'}
            w={'answer'}
            param={w.chosencriteria}
            selector={'timechart'}
            data={Object.values(this.props.data)}
          />
          </div>

          {z!=undefined &&
          <div className='row'>

            <strong style={{'color': 'steelblue'}}>Votes Distribution on Completed Tasks</strong><br />
            Total completed tasks: <i>{z[x]}</i>
            <br />

            <ChartWrapper 
              chart={'pie'}
              x={'turk_id'}
              y={'answer'}
              z={['item_id','criteria_id']}
              color={['orange','steelblue']}
              param={w.chosencriteria}
              selector={'chart_crowd'}
              data={Object.values(this.props.data)}
            />
            <strong style={{'color': 'steelblue'}}>Precision toward Gold Truth</strong><br />
            Total: <i>{
              ((z[y]/z[x])*100).toFixed(3)
              } %</i>

            <ChartWrapper 
              chart={'pie'}
              x={'turk_id'}
              y={'correct'}
              color={['lightgreen','orange']}
              z={['item_id','criteria_id']}
              param={w.chosencriteria}
              selector={'chart_gold'}
              data={Object.values(this.props.data)}
            />
          </div>
          }
        </div>
        <svg className={this.props.selector} width="1000" height="800"> </svg>
      </div>
    );
  }
}

SingleWorker.propTypes = {
  /*fetchSingleWorker: PropTypes.func,
  single_error: PropTypes.any,
	single_loading: PropTypes.bool,
	single: PropTypes.any,*/
}

const mapStateToProps = state => ({
  /*single: state.report.single_list.reports,
	single_error: state.report.single_list.error,
	single_loading: state.report.single_list.loading,*/
})

const mapDispatchToProps = dispatch => ({
  //fetchSingleWorker: (jobId,workerId) => dispatch(actions.fetchSingleWorker(workerId,jobId)),
})

export default connect (mapStateToProps,mapDispatchToProps)(SingleWorker)
