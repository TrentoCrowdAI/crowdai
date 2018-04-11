import React from 'react'
import { connect } from 'react-redux'
import * as d3 from 'd3'
import PropTypes from 'prop-types'
import Math from 'math'

class NestChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data : this.props.data
    }
    this.buildGraph = this.buildGraph(this);
  }

  buildGraph(ndata) {
    var svg = d3.select("."+this.props.selector);
    var x = this.props.x
    var y = this.props.y
    var z = this.props.z

    var data = this.props.data

    var margin = {top: 30, right: 30, bottom: 30, left: 30};
    var width = +svg.attr("width") - margin.left - margin.right;
    var height = +svg.attr("height") - margin.top - margin.bottom;
    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var color = this.props.color

  }

  componentDidMount() {
    this.state.data.sort( (a,b) =>
        (a[this.props.x] > b[this.props.x]) ? 1 : ((b[this.props.x] > a[this.props.x]) ? -1 : 0))
    this.buildGraph();
  }

  componentDidUpdate() {
    d3.select("."+this.props.selector).selectAll("g").remove();
    this.dataWrapper();
  }

  render() {
    //console.log(this.props)
    //console.log(this.state)
    return (
      <div>
        <svg className={this.props.selector} width="600" height="600"> </svg>
      </div>
    );
  }
}



NestChart.propTypes = {

}

const mapStateToProps = state => ({

})

const mapDispatchToProps = dispatch => ({

})

export default connect (mapStateToProps,mapDispatchToProps)(NestChart)
