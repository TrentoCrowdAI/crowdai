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
      order: this.props.x
    }
  }

  componentDidMount() {
  }

  componentDidUpdate() {
  }

  render() {
    var x = this.props.x
    var y = this.props.y
    var z = this.props.z
    var w = this.props.w
    var param = this.props.param

    return (
      <div className='nest'>
        <br />
        <div className='row'>
        {z ? 
            <React.Fragment>
              <strong style={{'color': 'steelblue', 'font-size': '15px'}}>{'Worker:   '}</strong>
              <strong style={{'color': 'steelblue', 'font-size': '25px'}}>{z['worker A']}</strong>
              <br />
              Worker ID: <span style={{'color': 'steelblue'}}>{z['id']}</span>
            </React.Fragment>
          : "" }
        </div>
        <br />
        <div className='rowC'>

          <div style={{'width': '70%'}}>
          <strong style={{'color': 'steelblue', 'font-size': '15px'}}>Completed Tasks timeline :</strong>
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

            <strong style={{'color': 'steelblue'}}>Votes Distribution on Completed Tasks :</strong><br />
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
            <strong style={{'color': 'steelblue'}}>Precision toward Gold Truth :</strong><br />
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
}

const mapStateToProps = state => ({
})

const mapDispatchToProps = dispatch => ({
})

export default connect (mapStateToProps,mapDispatchToProps)(SingleWorker)
