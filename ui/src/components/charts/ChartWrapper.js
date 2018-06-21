import React from 'react'
//import * as d3 from 'd3'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'

import SimpleLineChart from './SimpleLineChart.js'
import Histogram from './Histogram.js'
import HeatMap from './HeatMap.js'
import AreaChart from './AreaChart.js'
import NestChart from './NestChart.js'
import StackedBar from './StackedBar.js'
import DonutChart from './DonutChart.js'
import CompareLineChart from './CompareLineChart'
import TreeChart from './TreeChart'
import GroupedChart from './GroupedChart'

var count = 0;

class ChartWrapper extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data
    }
    //this.handleConcat = this.handleConcat.bind(this);
    //this.handleReduce = this.handleReduce.bind(this);
  }

  /*handleConcat() {
    var num = Math.floor(Math.random()*10)+1;
    for(var i=0; i<num; i++) {
      this.setState(prevState => ({
        data: prevState.data.concat(
          [{
            name: "nuovodato"+(count++).toString(),
            altezza: (Math.floor(Math.random()*60)+150),
            peso: (Math.floor(Math.random()*80)+40)
          }]
        )
      }))
    }
  }

  handleReduce() {
    this.setState(prevState => ({
      data: []
    }))
    count=0;
  }*/

  render() {
    switch(this.props.chart) {
      case 'histogram':
        return(
          <div>
          <Histogram
            {... this.props}
            />
          </div>
        );
      case 'linechart':
        return(
          <div>
          <SimpleLineChart
            {... this.props}
            />
          </div>
        );
      case 'heatmap':
        return(
          <div>
            <HeatMap 
              {... this.props}
              />
          </div>
        );
      case 'pie': 
        return(
          <div>
            <DonutChart
              {... this.props}
            />
          </div>
        );
      case 'nest': 
        return(
          <div>
            <NestChart
              {... this.props}
            />
          </div>
        );
      case 'stacked':
        return(
          <div>
            <StackedBar 
              {... this.props}
            />
          </div>
        )
        break;
      case 'linemetricchart':
        return(
          <div>
            <CompareLineChart
              {...this.props}
            />
          </div>
        )
        break;
      case 'treechart':
        return(
          <div>
            <TreeChart
              {...this.props}
            />
          </div>
        )
        break;
      case 'grouped':
        return(
          <div>
            <GroupedChart
              {...this.props}
            />
          </div>
        )
        break;
      default:
        return(
          <div>
            No data to display yet
            <svg width="1000"></svg>
          </div>
        );
    }
  }
}

ChartWrapper.propTypes = {

}

const mapStateToProps = state => ({

})

const mapDispatchToProps = dispatch => ({

})

export default connect(mapStateToProps,mapDispatchToProps)(ChartWrapper)
