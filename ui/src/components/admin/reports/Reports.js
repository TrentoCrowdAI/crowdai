import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import { actions } from './actions';
import { actions as expactions } from '../experiments/actions';
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
import './reports.css';

import ChartWrapper from 'src/components/charts/ChartWrapper';
import JobChooser from './JobChooser';
import WorkerChooser from './WorkerChooser';

var data = []
//= {"tasks":{"task1":{"total_time":2.21,"task_id":1},"task2":{"total_time":3.45,"task_id":3},"task3":{"total_time":4.65,"task_id":7},"task4":{"total_time":5.6,"task_id":2},"task5":{"total_time":9.6,"task_id":5},"task6":{"total_time":8.6,"task_id":9},"task7":{"total_time":2.6,"task_id":11},"task8":{"total_time":3.6,"task_id":32},"task9":{"total_time":4.6,"task_id":27},"task10":{"total_time":8.6,"task_id":21},"task11":{"total_time":7.6,"task_id":22}}}

const MetricOptions = [
	'Time to complete per Task',
	'Task details per Worker',
	'Percentage % of success',
	'Agreement metrics',
	'Classification decision and Probabilities',
	'Percentage % of Workers who failed Initial Test',
	'Percentage % of Workers who failed Honeypots'
]

var WorkerOptions = {
							all: 'All workers',
							id1: 'worker 1',
							id2: 'worker 2',
							id3: 'worker 3'
						}
var JobOptions = { }

class Reports extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			activeMetric : '(choose a metric)',
			chart: '',
			chosenjob: '',
			chosenworker: 'all'
		}
		this.activeMetric = this.activeMetric.bind(this)
		this.displayChart = this.displayChart.bind(this)
		this.chooseJob = this.chooseJob.bind(this)
		this.chooseWorker = this.chooseWorker.bind(this)
	}

	componentDidMount() {

		fetch('https://2mmbyxgwk6.execute-api.eu-central-1.amazonaws.com/reports')
		.then(response => response.json())
		.then(json => {
			data = Object.values(json.tasks)
		})

		this.props.fetchExperiments(this.props.match.params.projectid);
	}

	displayChart(metric) {
		this.setState({
			chart: metric
		})
	}

	activeMetric(event) {
		this.setState({
			activeMetric: event.target.value
		})
		this.displayChart(event.target.value)
		
	}

	chooseWorker(e, {value}) {
  	this.setState({
			...this.state, 
			chosenworker: value
		})
  }

	chooseJob(e, {value}) {
  	this.setState({
			...this.state, 
			chosenjob: value
		})
  }

	renderMetrics() {
		return(
			<div className="options">
				<Button 
					value='completetime'
					className='metrics'
					style={{marginBottom: '5px'}}
					onClick={this.activeMetric}
				>Time to complete per Task</Button>
				<br />
				<Button 
					value='successes'
					className='metrics' 
					style={{marginBottom: '5px'}}
					onClick={this.activeMetric}
				>Percentage % of success</Button>
				<br />
				<Button 
					value='agreements'
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
		JobOptions = { }
    this.props.experiments.rows.map( step => {
      JobOptions[step.id] = step.data.name
    });

		console.log(this.props)
		console.log(this.state)

		var optionbutt
		var chart
		switch (this.state.activeMetric) {
			case 'completetime':
				chart='nest'
				optionbutt = 
					<React.Fragment>
					<JobChooser 
						options={JobOptions}
						match={this.props.match}
						onChange={this.chooseJob}
						chosenjob={this.state.chosenjob}/>
					<WorkerChooser 
						options={WorkerOptions}
						match={this.props.match}
						onChange={this.chooseWorker}
						chosenworker={this.state.chosenworker}/>
					</React.Fragment>
				break;
			case 'successes':
				chart='nest'
				optionbutt = <JobChooser  
					options={JobOptions}
					match={this.props.match}
					onChange={this.chooseJob}
					chosenjob={this.state.chosenjob}/>
				break;
			case 'agreements':
				chart='linechart'
				optionbutt = <WorkerChooser 
					options={WorkerOptions}
					match={this.props.match}
					onChange={this.chooseWorker}
					chosenworker={this.state.chosenworker}/>
				break;
			default:
				optionbutt = ''
				break;
		}

		return(
			<div style={{margin: '20px'}}>
				
				<h3 style={{color: 'steelblue'}}>
					Selected Project: <i>{this.props.match.params.projectid}</i><br />
					Selected Job: <i>{this.state.chosenjob}</i><br />
					Selected Worker: <i>{this.state.chosenworker}</i>
				</h3>
				<hr />
				<h4>Available metrics:</h4>

				<div className="rowC">
					{this.renderMetrics()}

					<div>
						{optionbutt}
						<ChartWrapper 
							chart={chart}
            	x={'task_id'}
            	y={'total_time'}
            	selector={'chart1'}
            	color={'steelblue'}
            	data={data}
           	/>
					</div>
				</div>

			</div>
		);
	}
}

Reports.propTypes = {
  fetchExperiments: PropTypes.func,
  error: PropTypes.any,
  loading: PropTypes.bool,
  experiments: PropTypes.object,
  match: PropTypes.object
}

const mapDispatchToProps = dispatch => ({
  fetchExperiments: projectId => dispatch(expactions.fetchExperiments(projectId))
})

const mapStateToProps = state => ({
  experiments: state.experiment.list.experiments,
  error: state.experiment.list.error,
  loading: state.experiment.list.loading
})

export default connect(mapStateToProps,mapDispatchToProps)(Reports)
