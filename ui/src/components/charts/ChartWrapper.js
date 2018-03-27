import React from 'react'
//import * as d3 from 'd3'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'

import SimpleLineChart from './SimpleLineChart.js'
import Histogram from './Histogram.js'
import HeatMap from './HeatMap.js'
import AreaChart from './AreaChart.js'
import NestChart from './NestChart.js'

/*var chartData = [{
  name: "will",
  altezza: 160,
  peso: 92
},{
  name: "rob",
  altezza: 165,
  peso: 50
},{
  name: "july",
  altezza: 165,
  peso: 45
},{
  name: "fabio",
  altezza: 177,
  peso: 112
},{
  name: "rocky",
  altezza: 170,
  peso: 45
},{
  name: "rose",
  altezza: 160,
  peso: 55
},{
  name: "lola",
  altezza: 195,
  peso: 76
},{
  name: "dani",
  altezza: 150,
  peso: 55
}]*/

var count = 0;

class ChartWrapper extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data
    }
    this.handleConcat = this.handleConcat.bind(this);
    this.handleReduce = this.handleReduce.bind(this);
  }

  handleConcat() {
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
  }

  render() {
    switch(this.props.chart) {
      case 'histogram':
        return(
          <div>
          <Histogram
            handleConcat={this.handleConcat}
            handleReduce={this.handleReduce}
            data={this.state.data}
            {... this.props}
            />
          </div>
        );
      case 'linechart':
        return(
          <div>
          <SimpleLineChart
            handleConcat={this.handleConcat}
            handleReduce={this.handleReduce}
            data={this.state.data}
            {... this.props}
            />
          </div>
        );
      case 'heatmap':
        return(
          <div>
            <HeatMap 
              handleConcat={this.handleConcat} 
              handleReduce={this.handleReduce}
              data={this.state.data}
              {... this.props}
              />
          </div>
        );
      case 'area': 
        return(
          <div>
            <AreaChart
              handleConcat={this.handleConcat} 
              handleReduce={this.handleReduce}
              data={this.state.data}
              {... this.props}
            />
          </div>
        );
      case 'nest': 
        return(
          <div>
            <NestChart
              handleConcat={this.handleConcat} 
              handleReduce={this.handleReduce}
              data={this.state.data}
              {... this.props}
            />
          </div>
        );
      default:
        return(
          <div>
            missing chart
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
