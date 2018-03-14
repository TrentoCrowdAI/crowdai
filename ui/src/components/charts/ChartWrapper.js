import React from 'react'
import * as d3 from 'd3'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'

import SimpleLineChart from './SimpleLineChart.js'

class ChartWrapper extends React.Component {
  render() {
    return(
      <div>
        - Simple Line Chart -
        <SimpleLineChart x={'peso'} y={'altezza'} selector={'chart1'} color={'blue'}/>
        <hr />
        <SimpleLineChart x={'altezza'} y={'peso'} selector={'chart2'} color={'red'}/>
      </div>
    )
  }
}

ChartWrapper.propTypes = {

}

const mapStateToProps = state => {

}

const mapDispatchToProps = dispatch => {

}

export default connect(mapStateToProps,mapDispatchToProps)(ChartWrapper)
