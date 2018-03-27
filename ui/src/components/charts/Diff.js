import React from 'react'
import * as d3 from 'd3'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import ChartWrapper from './ChartWrapper'

var data = {
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
}

class Diff extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		var arr = Object.values(data);
		console.log(arr);
		return(
			<div>
				<ChartWrapper chart=''
          x={'total_time'}
          y={'task_id'}
          selector={'chart1'}
          color={'blue'}
          data={arr}/>
				<hr />
				<ChartWrapper chart=''
          x={'task_id'}
          y={'total_time'}
          selector={'chart2'}
          color={'red'}
          data={arr}/>
				<hr />
				<ChartWrapper chart=''
					x={'task_id'}
					y={'total_time'}
					selector={'chart4'}
					color={'steelblue'}
					data={arr}/>
				<hr />
				<ChartWrapper chart=''
          x={'task_id'}
          y={'total_time'}
          selector={'chart3'}v
          color={'green'}
          data={arr}/>
          <hr />
          <ChartWrapper chart='nest'
          	x={'task_id'}
          	y={'total_time'}
          	selector={'chart3'}v
          	color={'red'}
          	data={arr}/>
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
