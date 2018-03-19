import React from 'react'
//import * as d3 from 'd3'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'

import SimpleLineChart from './SimpleLineChart.js'
import Histogram from './Histogram.js'

var count = 0;

//data to retrieve from backend
var chartData = [{
  name: "will",
  altezza: 160,
  peso: 69
},{
  name: "rob",
  altezza: 185,
  peso: 90
},{
  name: "july",
  peso: 45,
  altezza: 165
},{
  name: "fabio",
  altezza: 177,
  peso: 65
},{
  name: "rocky",
  altezza: 170,
  peso: 88
},{
  name: "rose",
  altezza: 160,
  peso: 55
},{
  name: "lola",
  altezza: 190,
  peso: 76
}]

class ChartWrapper extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: chartData
    }
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
    console.log(this.state.data)
  }

  handleReduce() {
    this.setState(prevState => ({
      data: []
    }))
    count=0;
  }

  render() {
    return(
      <div>
        <SimpleLineChart
          handleConcat={this.handleConcat.bind(this)}
          handleReduce={this.handleReduce.bind(this)}
          data={this.state.data}
          x={'peso'}
          y={'altezza'}
          selector={'chart1'}
          color={'blue'}/>
        <hr />
        <SimpleLineChart
          handleConcat={this.handleConcat.bind(this)}
          handleReduce={this.handleReduce.bind(this)}
          data={this.state.data}
          x={'altezza'}
          y={'peso'}
          selector={'chart2'}
          color={'red'}/>
        <hr />
        <Histogram
          handleConcat={this.handleConcat.bind(this)}
          handleReduce={this.handleReduce.bind(this)}
          data={this.state.data}
          x={'peso'}
          selector={'chart3'}
          color={'grey'}/>
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
