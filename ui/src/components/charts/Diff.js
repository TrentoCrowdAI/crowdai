import React from 'react'
import * as d3 from 'd3'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import ChartWrapper from './ChartWrapper'

/*var data = {
	"task1":
		{"total_time":2.21,"task_id":1},
	"task2":
		{"total_time":3.45,"task_id":3},
	"task3":
		{"total_time":4.65,"task_id":7},
	"task4":
		{"total_time":5.6,"task_id":2},
	"task5":
		{"total_time":9.6,"task_id":5},
	"task6":
		{"total_time":8.6,"task_id":9},
	"task7":
		{"total_time":2.6,"task_id":11},
	"task8":
		{"total_time":3.6,"task_id":32},
	"task9":
		{"total_time":4.6,"task_id":27},
	"task10":
		{"total_time":8.6,"task_id":21},
	"task11":
		{"total_time":7.6,"task_id":22}
}*/

var data = {
	tasks : {
		question1: {
			item_id: 2,
			filter_id: 1,
			c1: 4,
			c2: 6,
			c3: 2
		},
		question2: {
			item_id: 2,
			filter_id: 2,
			c1: 2,
			c2: 4,
			c3: 0
		},
		question3: {
			item_id: 2,
			filter_id: 3,
			c1: 6,
			c2: 0,
			c3: 2
		},
		question4: {
			item_id: 1,
			filter_id: 2,
			c1: 0,
			c2: 2,
			c3: 9
		},
		question5: {
			item_id: 3,
			filter_id: 1,
			c1: 0,
			c2: 3,
			c3: 3
		},
		question6: {
			item_id: 3,
			filter_id: 4,
			c1: 1,
			c2: 1,
			c3: 4
		},
		question7: {
			item_id: 3,
			filter_id: 5,
			c1: 1,
			c2: 0,
			c3: 12
		},
		question8: {
			item_id: 3,
			filter_id: 6,
			c1: 9,
			c2: 6,
			c3: 3
		},
		question9: {
			item_id: 4,
			filter_id: 3,
			c1: 2,
			c2: 5,
			c3: 0
		}
	}
}

class Diff extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		var arr = Object.values(data.tasks);
		return(
			<div>
				<ChartWrapper 
          x={'item_id'}
          y={['c1','c2','c3']}
          chart={'stacked'}
          selector={'chart1'}
          data={arr}
				/>
			</div>
		)
	}

}

Diff.propTypes = {

}

const mapStateToProps = state => ({

})

const mapDispatchToProps = dispatch => ({

})

export default connect (mapStateToProps,mapDispatchToProps)(Diff)
