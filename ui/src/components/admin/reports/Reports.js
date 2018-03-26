import React from 'react'
import { connect } from 'react-redux'
import {
  Step,
  Icon,
  Segment,
  Grid,
  Form,
  Button,
  Statistic,
  Header,
  Image,
  Accordion,
  Message
} from 'semantic-ui-react';
import ChartWrapper from 'src/components/charts/ChartWrapper'
import './reports.css'

const data = {
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

const MetricOptions = [
	'Time to complete per Task',
	'Task details per Worker',
	'Percentage % of success',
	'Agreement metrics',
	'Classification decision and Probabilities',
	'Percentage % of Workers who failed Initial Test',
	'Percentage % of Workers who failed Honeypots'
]

class Reports extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			activeMetric : '(choose a metric)',
			chart: <React.Fragment>
								<h2>chart</h2>
								<br />
						 </React.Fragment>,
		}
		this.activeMetric = this.activeMetric.bind(this)
		this.displayChart = this.displayChart.bind(this)
	}

	componentDidMount() {

	}

	displayChart() {
		//convert data
		var arr = Object.values(data);
		console.log(arr)


		this.setState({
			chart: <React.Fragment>
						 <ChartWrapper chart='histogram'
            		x={'total_time'}
            		y={'task_id'}
            		selector={'chart1'}
            		color={'green'}
            		data={arr}
            		/>
						 </React.Fragment>
		})
		console.log(this.state)
	}

	activeMetric(e) {
		var chartData = []

		console.log(data)
		this.setState({
			activeMetric: e.target.value
		})

		this.displayChart()

		console.log(this.state)
	}

	renderMetrics() {
		return(
			<div className="options">
				<Button 
					value='Time to complete per Task'
					className='metrics' 
					style={{marginBottom: '5px'}}
					onClick={this.activeMetric}
				>Time to complete per Task</Button>
				<br />
				<Button 
					value='Task details per Worker'
					className='metrics' 
					style={{marginBottom: '5px'}}
					onClick={this.activeMetric}
				>Task details per Worker</Button>
				<br />
				<Button 
					value='Percentage % of success'
					className='metrics' 
					style={{marginBottom: '5px'}}
					onClick={this.activeMetric}
				>Percentage % of success</Button>
				<br />
				<Button 
					value='Agreement metrics'
					className='metrics' 
					style={{marginBottom: '5px'}}
					onClick={this.activeMetric}
				>Agreement metrics</Button>
				<br />
				<Button 
					value='Classification decision and Probabilities'
					className='metrics' 
					style={{marginBottom: '5px'}}
					onClick={this.activeMetric}
				>Classification decision and Probabilities</Button>
				<br />
				<Button 
					value='Percentage % of Workers who failed Initial Test'
					className='metrics' 
					style={{marginBottom: '5px'}}
					onClick={this.activeMetric}
				>Percentage % of Workers who failed Initial Test</Button>
				<br />
				<Button 
					value='Percentage % of Workers who failed Honeypots'
					className='metrics' 
					style={{marginBottom: '5px'}}
					onClick={this.activeMetric}
				>Percentage % of Workers who failed Honeypots</Button>
				<br />
			</div>
		)
	}

	render() {
		return(
			<div style={{margin: '20px'}}>
				
				<h2 style={{color: 'steelblue'}}>
					Selected Job: *extract job_id from location*
				</h2>
				<hr />
				<h3>Available metrics:</h3>
				<br />

				<div className="rowC">
					{this.renderMetrics()}

					<div>
						<h4 style={{color: 'steelblue'}}>Chart of: {this.state.activeMetric}</h4>
						{this.state.chart}
					</div>
				</div>

			</div>
		);
	}
}

Reports.propTypes = {

}

const mapDispatchToProps = dispatch => ({

})

const mapStateToProps = state => ({

})

export default connect(mapStateToProps,mapDispatchToProps)(Reports)
