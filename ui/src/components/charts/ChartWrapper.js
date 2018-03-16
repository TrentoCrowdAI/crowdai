import React from 'react'
//import * as d3 from 'd3'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'

import SimpleLineChart from './SimpleLineChart.js'
import Histogram from './Histogram.js'

var chartData = [{
  name: "will",
  altezza: "160",
  peso: "69"
},{
  name: "rob",
  altezza: "185",
  peso: "90"
},{
  name: "july",
  peso: "45",
  altezza: "165"
},{
  name: "fabio",
  altezza: "177",
  peso: "65"
},{
  name: "rocky",
  altezza: "170",
  peso: "88"
},{
  name: "rose",
  altezza: "160",
  peso: "55"
},{
  name: "lola",
  altezza: "190",
  peso: "76"
}]

class ChartWrapper extends React.Component {

  render() {
    return(
      <div>
        <SimpleLineChart
          data={chartData}
          x={'peso'}
          y={'altezza'}
          selector={'chart1'}
          color={'blue'}/>
        <hr />
        <SimpleLineChart
          data={chartData}
          x={'altezza'}
          y={'peso'}
          selector={'chart2'}
          color={'black'}/>
        <hr />
        <Histogram
          data={chartData}
          x={'altezza'}
          y={'peso'}
          selector={'chart3'}
          color={'green'}/>
        <hr />
      </div>
    )
  }
}

ChartWrapper.propTypes = {

}

const mapStateToProps = state => ({

})

const mapDispatchToProps = dispatch => ({

})

export default connect(mapStateToProps,mapDispatchToProps)(ChartWrapper)
