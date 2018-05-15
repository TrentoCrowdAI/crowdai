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
		this.props.fetchWorkers(this.props.match.params.jobid);
		//console.log(this.props.workers)
	}

	componentDidUpdate() {
//		console.log(this.props.reports)
	}

	activeMetric(e, {value}) {
		this.props.reports.tasks=[]
		switch(value) {
			case 'T_CompleteTime':
				this.props.fetchTaskTime(Number(this.props.match.params.jobid))
				break;
			case 'W_CompleteTime':
				this.props.fetchWorkerTime(Number(this.state.chosenworker))
				break;
			case 'Votes':
				this.props.fetchAnswers(Number(this.state.chosenworker))
				break;
			case 'Agreements':
				this.props.reports.tasks = Object.values(agreeData.tasks)
				break;
			default:
				console.log('Metric to implement: ', value)
				break;
		}

		this.setState({
			...this.state,
			activeMetric: value,
			activeworker: value=='T_CompleteTime'||value=='Agreements' ? false : true,
			chosenworker: value=='T_CompleteTime'||value=='Agreements' ? 'all' : this.state.chosenworker
		})
	}

	chooseWorker(e, {value}) {
		switch(this.state.activeMetric) {
			case 'Agreements':
				this.props.reports.tasks = Object.values(agreeData.tasks)
				break;
			case 'Votes':
				this.props.fetchAnswers(Number(value))
				break;
			default:
				this.props.fetchWorkerTime(value)		
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
			case 'Votes':
				this.props.reports.tasks = []
				break;
			case 'Agreements':
				this.props.reports.tasks = Object.values(agreeData.tasks)
				break;
			default:
				this.props.fetchTaskTime(value);
				break;
		}
		this.props.fetchWorkers(value);
		
		switch(this.state.activeMetric) {
			case 'W_CompleteTime':
			case 'Votes' :
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
					activeworker: this.state.activeMetric=='T_CompleteTime'||this.state.activeMetric=='Agreements' ? false : true
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
					value='Votes'
					className='metrics' 
					style={{marginBottom: '5px'}}
					onClick={this.activeMetric}
				>Percentage % of votes</Button>
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
		///JobOptions = { 'all' : 'All Jobs' }
		WorkerOptions = { 'all' : 'All Workers' }

    /*this.props.experiments.rows.map( step => {
      JobOptions[step.id] = step.data.name
    });*/
		Object.values(this.props.workers.workers).map( step => {
      WorkerOptions[step.worker_id] = step.worker_name
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
				x='item_id'
				y='num_tasks'
				z='criteria_id'
				break;

			case 'W_CompleteTime':
				chart='nest'
				x='item_id'
				y='num_tasks'
				z='criteria_id'
				break;

			case 'Agreements':
				chart='stacked'
				x='item_id'
				y=['c1','c2','c3']
				z='filter_id'
				break;

			case 'Votes':
				chart='pie'
				x='id'
				y='answer'
				z=''
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
	fetchWorkerTime: PropTypes.func,

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
	fetchWorkerTime: workerId => dispatch(actions.fetchWorkerTime(workerId)),
	fetchAnswers: workerId => dispatch(actions.fetchAnswers(workerId)),
	fetchWorkers: jobId => dispatch(actions.fetchWorkers(jobId))
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
