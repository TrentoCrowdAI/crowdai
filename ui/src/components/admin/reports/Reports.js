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
import { Z_UNKNOWN } from 'zlib';

//general data variable
var data = []

//fetched in componentDidMount()
var timeData = []

var agreeData = {
			tasks: {
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

var workerData = {
	tasks: {
		task1: {
			worker_id: 1, 
			total_time: 2.21,
			task_id: 1
		},
		task2: {
			worker_id: 3, 
			total_time: 3.55,
			task_id: 1
		},
		task3: {
			worker_id: 12, 
			total_time: 3.01,
			task_id: 1
		},
		task4: {
			worker_id: 1, 
			total_time: 3.45,
			task_id: 3
		},
		task5: {
			worker_id: 3, 
			total_time: 6.00,
			task_id: 3
		},
		task6: {
			worker_id: 22, 
			total_time: 4.22,
			task_id: 3
		},
		task7: {
			worker_id: 2, 
			total_time: 3.30,
			task_id: 3
		},
		task8: {
			worker_id: 1, 
			total_time: 5.6,
			task_id: 7
		},
		task9: {
			worker_id: 22, 
			total_time: 5.6,
			task_id: 7
		},
		task10: {
			worker_id: 10, 
			total_time: 2.6,
			task_id: 32
		},
		task11: {
			worker_id: 10, 
			total_time: 4.6,
			task_id: 27
		},
		task12: {
			worker_id: 1, 
			total_time: 8.23,
			task_id: 27
		},
		task13: {
			worker_id: 3, 
			total_time: 7.54,
			task_id: 27
		}
	}
}

var WorkerOptions = {
	'all' : 'All Workers'
}
var JobOptions = {
	'all' : 'All Jobs'
}

class Reports extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			activeMetric : '(choose a metric)',
			chosenjob: 'all',
			chosenworker: 'all',
			activeworker: false
		}
		this.activeMetric = this.activeMetric.bind(this)
		this.chooseJob = this.chooseJob.bind(this)
		this.chooseWorker = this.chooseWorker.bind(this)
	}

	componentDidMount() {
		this.props.fetchExperiments(this.props.match.params.projectid);
	}

	componentDidUpdate() {
		/*fetch('https://2mmbyxgwk6.execute-api.eu-central-1.amazonaws.com/reports')
		.then(response => response.json())
		.then(json => {
			timeData = Object.values(json.tasks)
		})*/
	}

	activeMetric(e, {value}) {
		this.setState({
			...this.state,
			activeMetric: value
		})
	}

	chooseWorker(e, {value}) {
  	this.setState({
			...this.state, 
			chosenworker: value
		})

		//fetch data of the worker, fill workerData

  }

	chooseJob(e, {value}) {
		console.log('job : ', value)
		this.props.fetchTaskTime(value);

  	this.setState({
			...this.state, 
			chosenjob: value,
			activeworker: true
		})

		//fetch data of the job, fill WorkerOptions

  }

	renderMetrics() {
		return(
			<div className="options">
				<Button 
					value='T_CompleteTime'
					className='metrics'
					style={{marginBottom: '5px'}}
					onClick={this.activeMetric}
				>Time to complete per Task</Button>
				<br />
				<Button 
					value='W_CompleteTime'
					className='metrics'
					style={{marginBottom: '5px'}}
					onClick={this.activeMetric}
				>Time to complete per Worker</Button>
				<br />
				<Button 
					value='Successes'
					className='metrics' 
					style={{marginBottom: '5px'}}
					onClick={this.activeMetric}
				>Percentage % of success</Button>
				<br />
				<Button 
					value='Agreements'
					className='metrics' 
					style={{marginBottom: '5px'}}
					onClick={this.activeMetric}
				>Agreement metrics</Button>
				<br />
				<Button 
					value='Classifications'
					className='metrics' 
					style={{marginBottom: '5px'}}
					onClick={this.activeMetric}
				>Classification decision and Probabilities</Button>
				<br />
				<Button 
					value='Initial_Fails'
					className='metrics' 
					style={{marginBottom: '5px'}}
					onClick={this.activeMetric}
				>Percentage % of Workers who failed Initial Test</Button>
				<br />
				<Button 
					value='Honeypots_Fails'
					className='metrics' 
					style={{marginBottom: '5px'}}
					onClick={this.activeMetric}
				>Percentage % of Workers who failed Honeypots</Button>
				<br />
			</div>
		)
	}

	renderChart(chart,x,y,z,data, choice, choice_id) {
		return(
			<React.Fragment>
			<ChartWrapper 
				chart={chart}
        x={x}
        y={y}
        z={z}
        selector={'chart1'}
        color={'steelblue'}
				data={data}
				choice={choice}
				choice_id={choice_id}
      />
      </React.Fragment>
		)
	}

	render() {

		timeData = Object.values(this.props.reports.tasks)
		
		JobOptions = {
			'all' : 'All Jobs'
		}
    this.props.experiments.rows.map( step => {
      JobOptions[step.id] = step.data.name
    });
		console.log(JobOptions)
		//WorkerOptions should contain all the workers for te selected Job
		Object.values(workerData.tasks).map(d => WorkerOptions[d.worker_id]=d.worker_id)
		    
		var optionbutt
		var chart
		var x
		var y
		var z

		var choice
		var choice_id

		switch (this.state.activeMetric) {

			case 'T_CompleteTime':
				chart='histogram'
				x='total_time'
				y='task_id'
				z=''

				choice='j'
				choice_id=this.state.chosenjob

				optionbutt = 
					<React.Fragment>
					<JobChooser 
						options={JobOptions}
						match={this.props.match}
						onChange={this.chooseJob}
						chosenjob={this.state.chosenjob}/>
					</React.Fragment>

				data = timeData
				break;

			case 'W_CompleteTime':
				chart='nest'
				x='task_id'
				y='total_time'
				//group or filter by z
				z='worker_id'

				choice='w'
				choice_id= this.state.chosenworker=='' ? 'all' : this.state.chosenworker

				optionbutt=
					<React.Fragment>
					<JobChooser 
						options={JobOptions}
						match={this.props.match}
						onChange={this.chooseJob}
						chosenjob={this.state.chosenjob}/>
					<WorkerChooser 
						disabled={!this.state.activeworker}
						options={WorkerOptions}
						match={this.props.match}
						onChange={this.chooseWorker}
						chosenworker={this.state.chosenworker}
						/>
					</React.Fragment>
				data = Object.values(workerData.tasks)//.filter(d => d.worker_id==this.state.chosenworker)
				break;

			case 'Agreements':
				chart='stacked'
				//first groupby
				x='item_id'
				//categories
				y=['c1','c2','c3']
				//second groupby
				z='filter_id'

				choice='j'
				choice_id=this.state.chosenjob

				optionbutt = 
					<React.Fragment>
					<JobChooser 
						options={JobOptions}
						match={this.props.match}
						onChange={this.chooseJob}
						chosenjob={this.state.chosenjob}/>
					</React.Fragment>

				data = Object.values(agreeData.tasks)
				break;

			case 'Successes':
				chart='pie'
				x=''
				y=''
				z=''

				choice='w'
				choice_id=this.state.chosenworker

				optionbutt=
					<React.Fragment>
					<JobChooser 
						options={JobOptions}
						match={this.props.match}
						onChange={this.chooseJob}
						chosenjob={this.state.chosenjob}/>
					<WorkerChooser 
						disabled={!this.state.activeworker}
						options={WorkerOptions}
						match={this.props.match}
						onChange={this.chooseWorker}
						chosenworker={this.state.chosenworker}
						/>
					</React.Fragment>
					data=[]
				break;

			default:
				optionbutt = ''
				data = []
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
						{this.renderChart(chart,x,y,z,data, choice, choice_id)}
					</div>
				</div>

			</div>
		);
	}
}

Reports.propTypes = {
	fetchExperiments: PropTypes.func,
	fetchTaskTime: PropTypes.func,
  exp_error: PropTypes.any,
  exp_loading: PropTypes.bool,
	experiments: PropTypes.object,
	match: PropTypes.object,
	rep_error: PropTypes.any,
	rep_loading: PropTypes.bool,
	reports: PropTypes.any
}

const mapDispatchToProps = dispatch => ({
	fetchExperiments: projectId => dispatch(expactions.fetchExperiments(projectId)),
	fetchTaskTime: jobId => dispatch(actions.fetchTaskTime(jobId))
})

const mapStateToProps = state => ({
  experiments: state.experiment.list.experiments,
  exp_error: state.experiment.list.error,
	exp_loading: state.experiment.list.loading,
	reports: state.report.list.reports,
	rep_error: state.report.list.error,
	rep_loading: state.report.list.loading
})

export default connect(mapStateToProps,mapDispatchToProps)(Reports)
