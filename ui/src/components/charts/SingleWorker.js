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
    var data = this.props.data[0]
    var x = this.props.x
    var y = this.props.y
    var z = this.props.z
    var data = data
    var w = this.props.w
    var param = this.props.param

    //buil interface for single worker metrics analysis
    return (
      <div className='nest'>
        <br />

        {this.props.data.length>0 ?
        <React.Fragment>
        <div className='row'>
          <React.Fragment>
            {'Worker:   '}
            <strong style={{'color': '#2185d0', 'fontSize': '25px'}}>{data['worker A']}</strong>
            <hr />
            {'Worker ID:   '}
            <strong style={{'color': '#2185d0'}}>{data['id']}</strong>
            <br />
            {'Registered since:   '}
            <strong style={{'color': '#2185d0'}}>{
              new Date(data['registered since']).getDate()
              +'/'+((new Date(data['registered since']).getMonth())+1)
              +'/'+new Date(data['registered since']).getFullYear()
              +' at '+new Date(data['registered since']).getHours()
              +':'+new Date(data['registered since']).getMinutes()
              }</strong>
          </React.Fragment>
        </div>
        <hr />
        <div className='rowC'>

          <div >
          <strong style={{'color': '#2185d0', 'fontSize': '15px'}}>Completed Tasks Timeline :</strong>
          <br />
          <ChartWrapper  
            chart={'timeLineChart'}
            x={'item_id'}
            y={'delivery'}
            z={'criteria_id'}
            w={'answer'}
            color={['orange','#2185d0','lightgreen']}
            param={[w.chosenitem,w.chosencriteria]}
            selector={'timeline_chart'}
            data={Object.values(data[z])}
          />
          <br />
          <strong style={{'color': '#2185d0', 'fontSize': '15px'}}>Tasks Completion Times :</strong>
          <br />
          <ChartWrapper  
            chart={'nestChart'}
            x={'item_id'}
            y={'completion time'}
            z={'criteria_id'}
            w={'correct'}
            param={1000}
            color={['lightgreen','orange','#2185d0']}
            selector={'wcompletion_chart'}
            data={Object.values(data[z])}
          />
          </div>

          <div className='row'>

            <strong style={{'color': '#2185d0'}}>Votes Distribution on Completed Tasks :</strong><br />
            Total completed tasks: <i>{data[x]}</i>
            <br />

            <ChartWrapper 
              chart={'donutChart'}
              x={'turk_id'}
              y={'answer'}
              z={['item_id','criteria_id']}
              color={['orange','#2185d0','lightgreen']}
              param={[w.chosenitem,w.chosencriteria]}
              selector={'chart_crowd'}
              data={Object.values(data[z])}
            />
            <strong style={{'color': '#2185d0'}}>Precision toward Gold Truth :</strong><br />
            Total: <i>{
              ((data[y]/data[x])*100).toFixed(3)
              } %</i>

            <ChartWrapper 
              chart={'donutChart'}
              x={'turk_id'}
              y={'correct'}
              color={['lightgreen','orange','#2185d0']}
              z={['item_id','criteria_id']}
              param={[w.chosenitem,w.chosencriteria]}
              selector={'chart_gold'}
              data={Object.values(data[z])}
            />
          </div>

        </div>
        </React.Fragment> : <div>Choose a Worker</div>
        }

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
