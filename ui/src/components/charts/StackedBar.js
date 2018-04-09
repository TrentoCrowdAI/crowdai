import React from 'react'
import { connect } from 'react-redux'
import * as d3 from 'd3'
import PropTypes from 'prop-types'
import Math from 'math'

var data = {
	tasks : {
		question1: {
			c1: 24,
			c2: 294,
			c3: 594,
			c4: 1927,
			c5: 376
		},
		question2: {
			c1: 2,
			c2: 2,
			c3: 0,
			c4: 7,
			c5: 0	
		},
		question3: {
			c1: 2,
			c2: 0,
			c3: 2,
			c4: 4,
			c5: 2
		},
		question4: {
			c1: 0,
			c2: 2,
			c3: 1,
			c4: 7,
			c5: 6
		},
		question5: {
			c1: 0,
			c2: 1,
			c3: 3,
			c4: 16,
			c5: 4
		},
		question6: {
			c1: 1,
			c2: 1,
			c3: 2,
			c4: 9,
			c5: 3
		},
		question7: {
			c1: 0,
			c2: 0,
			c3: 1,
			c4: 4,
			c5: 0
		},
		question8: {
			c1: 46,
			c2: 23,
			c3: 15,
			c4: 0,
			c5: 0
		},
		question9: {
			c1: 1,
			c2: 56,
			c3: 0,
			c4: 0,
			c5: 0
		}
	}
}

class StackedBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data : data.tasks
    }
    this.buildGraph = this.buildGraph.bind(this);
  }

  buildGraph() {
  	var svg = d3.select("."+this.props.selector);
    var c1 = this.props.c1
    var c2 = this.props.c2
    var c3 = this.props.c3
    var c4 = this.props.c4
    var c5 = this.props.c5

    var margin = {top: 30, right: 30, bottom: 30, left: 30};
    var width = +svg.attr("width") - margin.left - margin.right;
    var height = +svg.attr("height") - margin.top - margin.bottom;
    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    var color = d3.scaleOrdinal()
    		.range(["#c7001e", "#f6a580", "#cccccc", "#92c6db", "#086fad"])

    var yscale = d3.scaleOrdinal()
    		.range([0, height], .3)

    var xscale = d3.scaleLinear()
    		.range([0, width])

    var xAxis = d3.axisTop(xscale)
    var yAxis = d3.axisLeft(yscale)

    color.domain(["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"])
	


  }

  componentDidMount() {
    this.buildGraph();
  }

  componentDidUpdate() {
    d3.select("."+this.props.selector).selectAll("g").remove();
    this.buildGraph();
  }

  render() {
    return (
    );
  }
}



StackedBar.propTypes = {

}

const mapStateToProps = state => ({

})

const mapDispatchToProps = dispatch => ({

})

export default connect (mapStateToProps,mapDispatchToProps)(StackedBar)
