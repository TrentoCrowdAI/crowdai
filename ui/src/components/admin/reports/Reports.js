import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import ChartWrapper from 'src/components/charts/ChartWrapper';
import JobChooser from './JobChooser';
import WorkerChooser from './WorkerChooser';
import { Button, Dimmer, Loader } from 'semantic-ui-react';
import './reports.css';

import { actions } from './actions';
//import { actions as expactions } from '../experiments/actions';

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

var WorkerOptions = {
	'all' : 'All Workers'
}
/*var JobOptions = {
	'all' : 'All Jobs'
}*/

class Reports extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			activeMetric : '(choose a metric)',
			//chosenjob: this.props.match.params.jobid,
			chosenworker: 'all',
			activeworker: false
		}
		this.activeMetric = this.activeMetric.bind(this)
		//this.chooseJob = this.chooseJob.bind(this)
		this.chooseWorker = this.chooseWorker.bind(this)
	}

	componentDidMount() {
		this.props.fetchWorkers(this.props.match.params.jobid)
	}

	componentDidUpdate() {
//		console.log(this.props.reports)
	}

	activeMetric(e, {value}) {
		this.props.reports.tasks=[]
		switch(value) {
			case 'T_CompleteTime':
				this.props.fetchTaskTime(this.props.match.params.jobid)//(Number(this.props.match.params.jobid))
				break;
			case 'W_CompleteTime':
				this.props.fetchWorkerTimes(this.props.match.params.jobid,Number(this.state.chosenworker))
				break;
			case 'Percentage':
				this.props.fetchAnswers(this.props.match.params.jobid,Number(this.state.chosenworker))
				break;
			case 'Distribution':
				//this.props.reports.tasks = Object.values(agreeData.tasks)
				this.props.fetchTasksAgreements(this.props.match.params.jobid)
				break;
			case 'Classification':
				this.props.fetchWorkersAgreements(this.props.match.params.jobid,1,1);
				break;
			default:
				console.log('Metric to implement: ', value)
				break;
		}

		this.setState({
			...this.state,
			activeMetric: value,
			activeworker: value=='T_CompleteTime'||value=='Distribution'||value=='Classification' ? false : true,
			chosenworker: value=='T_CompleteTime'||value=='Distribution'||value=='Classification' ? 'all' : this.state.chosenworker
		})
	}

	chooseWorker(e, {value}) {
		switch(this.state.activeMetric) {
			case 'Percentage':
				if (value=='all')
					this.props.reports.tasks = []
				else
					this.props.fetchAnswers(this.props.match.params.jobid,Number(value))
				break;
			case 'W_CompleteTime':
				if (value=='all')
					this.props.reports.tasks = []
				else
					this.props.fetchWorkerTimes(this.props.match.params.jobid,Number(value))
				break;
			default:
				break;
		}

		this.setState({
			...this.state, 
			chosenworker: value
		})
}

	/*chooseJob(e, {value}) {
		switch(this.state.activeMetric) {
			case 'W_CompleteTime':
			case 'Percentage':
				this.props.reports.tasks = []
				break;
			case 'Distribution':
				this.props.reports.tasks = Object.values(agreeData.tasks)
				break;
			default:
				this.props.fetchTaskTime(value);
				break;
		}
		this.props.fetchWorkers(value);
		
		switch(this.state.activeMetric) {
			case 'W_CompleteTime':
			case 'Percentage' :
				this.setState({
					...this.state,
					chosenjob: value,
					chosenworker: 'all'
				})
				break;
			default:
				this.setState({
					...this.state, 
					chosenjob: value,
					chosenworker: 'all',
					activeworker: this.state.activeMetric=='T_CompleteTime'||this.state.activeMetric=='Distribution' ? false : true
				})
				break;
		}
  }
*/
	renderMetrics() {
		return(
			<div className="options">
				<Button 
					value='T_CompleteTime'
					className='metrics'
					style={{marginBottom: '5px'}}
					onClick={this.activeMetric}
				>Time to complete per Job</Button>
				<br />
				<Button 
					value='W_CompleteTime'
					className='metrics'
					style={{marginBottom: '5px'}}
					onClick={this.activeMetric}
				>Time to complete per Worker</Button>
				<br />
				<Button 
					value='Percentage'
					className='metrics' 
					style={{marginBottom: '5px'}}
					onClick={this.activeMetric}
				>Percentage % of Votes</Button>
				<br />
				<Button 
					value='Distribution'
					className='metrics' 
					style={{marginBottom: '5px'}}
					onClick={this.activeMetric}
				>Votes Distribution per Task</Button>
				<br />
				<Button 
					value='Classification'
					className='metrics' 
					style={{marginBottom: '5px'}}
					onClick={this.activeMetric}
				>Task Classification and Worker Agreement</Button>
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

	renderChart(chart,x,y,z) {
		return(
			<div>
			<Dimmer active={this.props.rep_loading} inline="centered" inverted>
          <Loader indeterminate>Loading data...</Loader>
      </Dimmer>
			<ChartWrapper 
				chart={chart}
        x={x}
        y={y}
        z={z}
        selector={'chart1'}
        color={'steelblue'}
				data={Object.values(this.props.reports.tasks)}
      />
      </div>
		)
	}

	render() {
		console.log(this.props.reports)
		//console.log(this.props.workers)
		///JobOptions = { 'all' : 'All Jobs' }
		WorkerOptions = { 'all' : 'All Workers' }

    /*this.props.experiments.rows.map( step => {
      JobOptions[step.id] = step.data.name
    });*/
		Object.values(this.props.workers.workers).map( step => {
      WorkerOptions[step.worker_id] = step.turk_id
		});

		var chart
		//first group_by
		var x
		//categories
		var y
		//second group_by if necessary
		var z
		switch (this.state.activeMetric) {

			case 'T_CompleteTime':
				chart='histogram'
				x='avgtime_ms'
				y='item_id'
				z='criteria_id'
				break;

			case 'W_CompleteTime':
				chart='nest'
				x='item_id'
				y='avgtime_ms'
				z='criteria_id'
				break;

			case 'Distribution':
				chart='stacked'
				x='item_id'
				y=['c1','c2','c3']
				z='criteria_id'
				break;

			case 'Percentage':
				chart='pie'
				x='id'
				y='answer'
				z=['item_id','criteria_id']
				break;

			case 'Classification' :
				chart='linechart'
				x='worker_id'
				y='answer'
				z=['yes','no','not clear']
				break;

			default:
				break;
		}

/**
 * <JobChooser 
					options={JobOptions}
					onChange={this.chooseJob}
					chosenjob={this.state.chosenjob}
				/>
			
 */

		return(
			<div style={{margin: '20px'}}>

				<div className="rowC">
				<h3 style={{color: 'steelblue'}}>
					Selected Job_id: <i>{this.props.match.params.jobid}</i><br />
					Selected Worker_id: <i>{this.state.chosenworker}</i>
				</h3>

				<div style={{width: "20%"}}></div>

				<div>
				<WorkerChooser 
					disabled={(!this.state.activeworker)}//|| (this.state.chosenjob=='all')}
					options={WorkerOptions}
					onChange={this.chooseWorker}
					chosenworker={this.state.chosenworker}
				/>
				</div>
				</div>

				<hr />
				<h4>Available metrics:</h4>

				<div className="rowC">
				{this.renderMetrics()}
				{this.renderChart(chart,x,y,z)}
				</div>

			</div>
		);
	}
}

Reports.propTypes = {
	//fetchExperiments: PropTypes.func,
	fetchTaskTime: PropTypes.func,
	fetchWorkers: PropTypes.func,
	fetchAnswers: PropTypes.func,
	fetchWorkerTimes: PropTypes.func,
	fetchTasksAgreements: PropTypes.func,
	fetchWorkersAgreements: PropTypes.func,

  //exp_error: PropTypes.any,
  //exp_loading: PropTypes.bool,
	//experiments: PropTypes.any,
	match: PropTypes.object,

	rep_error: PropTypes.any,
	rep_loading: PropTypes.bool,
	reports: PropTypes.any,

	worker_error: PropTypes.any,
	worker_loading: PropTypes.bool,
	workers: PropTypes.any
}

const mapDispatchToProps = dispatch => ({
	//fetchExperiments: projectId => dispatch(expactions.fetchExperiments(projectId)),
	fetchTaskTime: jobId => dispatch(actions.fetchTaskTime(jobId)),
	fetchWorkerTimes: (jobId,workerId) => dispatch(actions.fetchWorkerTimes(jobId,workerId)),
	fetchAnswers: (jobId,workerId) => dispatch(actions.fetchAnswers(jobId,workerId)),
	fetchWorkers: jobId => dispatch(actions.fetchWorkers(jobId)),
	fetchTasksAgreements: jobId => dispatch(actions.fetchTasksAgreements(jobId)),
	fetchWorkersAgreements: (jobId,itemId,criteriaId) => dispatch(actions.fetchWorkersAgreements(jobId,itemId,criteriaId))
})

const mapStateToProps = state => ({
  //experiments: state.experiment.list.experiments,
  //exp_error: state.experiment.list.error,
	//exp_loading: state.experiment.list.loading,

	reports: state.report.list.reports,
	rep_error: state.report.list.error,
	rep_loading: state.report.list.loading,

	workers: state.report.wlist.workers,
	worker_error: state.report.wlist.error,
	worker_loading: state.report.wlist.loading,
})

export default connect(mapStateToProps,mapDispatchToProps)(Reports)
