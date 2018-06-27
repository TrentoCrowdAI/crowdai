import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import ChartWrapper from 'src/components/charts/ChartWrapper';
import JobChooser from './JobChooser';
import WorkerChooser from './WorkerChooser';
import ItemChooser from './ItemChooser';
import CritChooser from './CritChooser';
import MetricChooser from './MetricChooser';
import MetricMenu from './MetricMenu';
import { Dimmer, Loader } from 'semantic-ui-react';

import './reports.css';
import { actions } from './actions';
import { actions as jobactions } from '../jobs/actions';

class Reports extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			chosenmetric : '(choose a metric)',
			chosenworker: 'all',
			activeworker: false,
			chosencriteria: 'all',
			activecriteria: false,
			chosenitem: 'all',
			activeitem: false
		}
		this.chooseMetric = this.chooseMetric.bind(this)
		this.chooseWorker = this.chooseWorker.bind(this)
		this.chooseCriteria = this.chooseCriteria.bind(this)
		this.chooseItem = this.chooseItem.bind(this)
	}

	componentDidMount() {
		this.props.fetchWorkers(this.props.match.params.jobid)
	}

	componentDidUpdate() {
	}

	chooseMetric(e, {value}) {
		switch(value) {
			case 'T_CompleteTime':
				this.props.reports.tasks=[]
				this.props.fetchTaskTime(this.props.match.params.jobid)
				break;
			case 'Distribution':
				this.props.reports.tasks=[]
				this.props.fetchTasksAgreements(this.props.match.params.jobid)
				break;
			case 'Classification':
				this.props.reports.tasks=[]
				this.props.fetchCrowdGolds(this.props.match.params.jobid);
				break;
			case 'TwoWorkers':
				this.props.reports.tasks=[]
				//this.props.fetchMetric('ww/job/'+this.props.match.params.jobid+'/stats');
				this.props.fetchWorkersPairs(this.props.match.params.jobid)
				break;
			case 'SingleWorker':
				this.props.reports.tasks=[]
				//this.props.fetchMetric('worker/job/'+this.props.match.params.jobid+'/contribution');
				//this.props.fetchAnswers(this.props.match.params.jobid,Number(this.state.chosenworker))
				this.props.fetchSingleWorker(this.props.match.params.jobid,this.state.chosenworker)
				break;
			case 'Contribution':
				this.props.reports.tasks=[]
				this.props.fetchContribution(this.props.match.params.jobid)
				//this.props.fetchMetric('worker/job/'+this.props.match.params.jobid+'/contribution');
				break;
			case 'Global':
				this.props.reports.tasks=[]
				this.props.fetchJobStats(this.props.match.params.jobid)
				//this.props.fetchMetric('global/job/'+this.props.match.params.jobid+'/stats')
			default:
				console.log('Metric to implement: ', value)
				break;
		}

		this.setState({
			...this.state,
			chosenmetric: value,
			activeworker: /*value==='W_CompleteTime'||value==='Percentage'||*/value==='SingleWorker' ? true : false,
			chosenworker: /*value==='W_CompleteTime'||value==='Percentage'||*/value==='SingleWorker' ? this.state.chosenworker : 'all',
			chosenitem: value==='Distribution'||value==='SingleWorker' ? this.state.chosenitem : 'all',
			chosencriteria: /*value==='Percentage'||*/value==='Distribution'||value==='SingleWorker' ? this.state.chosencriteria : 'all',
			activeitem: value==='Distribution'||value==='SingleWorker' ? true : false,
			activecriteria: /*value==='Percentage'||*/value==='Distribution'||value==='SingleWorker' ? true : false
		})
	}

	chooseWorker(e, {value}) {
		switch(this.state.chosenmetric) {
			/*case 'Percentage':
				if (value==='all')
					this.props.reports.tasks = []
				else
					this.props.fetchAnswers(this.props.match.params.jobid,Number(value))
				break;*/
			case 'SingleWorker':
				if (value==='all') {
					this.props.reports.tasks = []
				} else {
					this.props.fetchSingleWorker(this.props.match.params.jobid,Number(value))
				}
				break;
			/*case 'W_CompleteTime':
				if (value==='all')
					this.props.reports.tasks = []
				else
					this.props.fetchWorkerTimes(this.props.match.params.jobid,Number(value))
				break;*/
			default:
				break;
		}

		this.setState({
			...this.state, 
			chosenworker: value
		})
}

	chooseItem(e, {value}) {
		this.setState({
			...this.state,
			chosenitem: value,
			activecriteria: true
		})
	}

	chooseCriteria(e, {value}) {
		this.setState({
			...this.state,
			chosencriteria: value
		})		
	}

renderChart(chart,x,y,z,w,param) {
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
				w={w}
        selector={'chart1'}
				param={param}
				data={Object.values(this.props.reports.tasks)}
      />
      </div>
		)
	}

	render() {
		console.log('reports tasks ',this.props.reports.tasks)
		//console.log('single worker tasks ',this.props.single.tasks)
		
		//refresh options for charts with new loaded data every time
		var WorkerOptions =  { 'all' : 'All Workers' }
		Object.values(this.props.workers.workers).map( step => {
      WorkerOptions[step.worker_id] = step.turk_id
		});
		
		var ItemOptions = { 'all': 'All Items' }
		Object.values(
			(this.state.chosenmetric==='SingleWorker' && this.props.reports.tasks.length)
				? this.props.reports.tasks[0].answers : this.props.reports.tasks
		).map( step => {
      ItemOptions[step.item_id] = step.item_id
		});

		var CritOptions = { 'all' : 'All Criteria' }
		Object.values(
			(this.state.chosenmetric==='SingleWorker' && this.props.reports.tasks.length)
				? this.props.reports.tasks[0].answers : this.props.reports.tasks
		).map( step => {
      CritOptions[step.criteria_id] = step.criteria_id
		});

		var MetricOptions = {
			'Cohen': "Cohen's Kappa",
			'M1': "Basic Agreement [ M1 ]",
			'Bennett': "Bennett's S",
			'WWM2(a|b)': "Probability in Errors [ P_err(A|B) ]",
			'WWM2(b|a)': "Probability in Errors [ P_err(B|A) ]",
			'Comparing': "Comparing Correlation Metrics"
		}
		//parameters for reusable charts
		var chart //to define kind of chart
		var x //first group_by
		var y //categories
		var z //second group_by if necessary
		var w
		var param='' //just used in some charts to add more details

		//show different reports
		switch (this.state.chosenmetric) {

			case 'T_CompleteTime':
				chart='histogram'
				x='avgtime_ms'
				y='item_id'
				z='criteria_id'
				param=1000
				break;

			/*case 'W_CompleteTime':
				chart='nest'
				x='item_id'
				y='avgtime_ms'
				z='criteria_id'
				param=1000
				break;*/

			case 'Distribution':
				chart='stacked'
				x='item_id'
				y=['no','not clear','yes']
				z='criteria_id'
				param=[this.state.chosenitem,this.state.chosencriteria]
				break;

			/*case 'Percentage':
				chart=''
				x=''
				y=''
				z=''
				w=''
				param=''
				break;*/

			case 'Classification' :
				chart='treechart'
				x='item_id'
				y='criteria_id'
				z=['yes','no']
				w='answer'
				param=this.state.chosenitem
				break;

			case 'TwoWorkers':
				x=''
				y=''
				z=''
				param=1
				break;

			case 'Cohen':
				chart='heatmap'
				x='worker A'
				y='worker B'
				z='cohen\'s kappa correlation'
				param=1
				break;

			case 'M1':
				chart='heatmap'
				x='worker A'
				y='worker B'
				z='basic agreement'
				param=1
				break;

			case 'Bennett':
				chart='heatmap'
				x='worker A'
				y='worker B'
				z='bennett\'s s'
				param=1
				break;

			case 'WWM2(a|b)':
				chart='heatmap'
				x='worker A'
				y='worker B'
				z='probability in errors(a|b)'
				param=1
				break;

			case 'WWM2(b|a)':
				chart='heatmap'
				x='worker A'
				y='worker B'
				z='probability in errors(b|a)'
				param=1
				break;

			case 'Contribution':
				chart='histogram'
				x='contribution to crowd error'
				y='id'
				z='worker A'
				param=1
				break;

			case 'Global':
				chart='grouped'
				x=['item_id','null']
				y='F1-score'
				z='Matthews Correlation Coefficient'
				w='Diagnostic Odds Ratio'
				param=1
				break;

			case 'Comparing':
				chart='grouped'
				x=['worker A','worker B']
				y="cohen's kappa correlation"
				z="basic agreement"
				w="bennett\'s s"
				param=1
				break;

			case 'SingleWorker':
				chart='singleworker'
				x='number of completed tasks'
				y='times voted right comparing with gold truth'
				z='answers'
				w=this.state
				param=this.props.match
				break;

			default:
				break;
		}

		return(
			<div style={{margin: '20px'}}>
				<div className="rowC">
				{
							(this.state.chosenmetric==="Cohen"
							||this.state.chosenmetric==="M1"
							||this.state.chosenmetric==="Bennett"
							||this.state.chosenmetric==="WWM2(a|b)"
							||this.state.chosenmetric==="WWM2(b|a)"
							||this.state.chosenmetric==="TwoWorkers"
							||this.state.chosenmetric==="Comparing") && 
							<React.Fragment>
							<div className='row' style={{'display': 'flex', 'color': 'steelblue'}}>
								<br />
								<MetricChooser 
									options={MetricOptions}
									onChange={this.chooseMetric}
									chosenmetric={this.state.chosenmetric}
								/>
								<br />
							</div>
							<div style={{width: "5%"}} className='empty'></div>
							</React.Fragment>
					}
					<WorkerChooser 
						disabled={(!this.state.activeworker)}
						options={WorkerOptions}
						onChange={this.chooseWorker}
						chosenworker={this.state.chosenworker}
					/>
					<div style={{width: "5%"}} className='empty'></div>
					<ItemChooser 
						disabled={(!this.state.activeitem)}
						options={ItemOptions}
						onChange={this.chooseItem}
						chosenitem={this.state.chosenitem}
					/>
					<div style={{width: "5%"}} className='empty'></div>
					<CritChooser 
						disabled={(!this.state.activecriteria)}
						options={CritOptions}
						onChange={this.chooseCriteria}
						chosencriteria={this.state.chosencriteria}
					/>
				</div>

				<br />

				<div className="rowC">
					<div className='options'>
						<MetricMenu onChange={this.chooseMetric}/>
					</div>
					{this.renderChart(chart,x,y,z,w,param)}
				</div>
			
			</div>
		);
	}
}

Reports.propTypes = {
	fetchTaskTime: PropTypes.func,
	fetchWorkers: PropTypes.func,
	//fetchAnswers: PropTypes.func,
	//fetchWorkerTimes: PropTypes.func,
	fetchTasksAgreements: PropTypes.func,
	//fetchWorkersAgreements: PropTypes.func,
	fetchCrowdGolds: PropTypes.func,
	fetchWorkersPairs: PropTypes.func,
	fetchSingleWorker: PropTypes.func,
	fetchJobStats: PropTypes.func,
	fetchContribution: PropTypes.func,

	fetchItems: PropTypes.func,
	fetchCriteria: PropTypes.func,
	match: PropTypes.object,

	rep_error: PropTypes.any,
	rep_loading: PropTypes.bool,
	reports: PropTypes.any,

	worker_error: PropTypes.any,
	worker_loading: PropTypes.bool,
	workers: PropTypes.any,
}

const mapDispatchToProps = dispatch => ({
	fetchTaskTime: jobId => dispatch(actions.fetchTaskTime(jobId)),
	//fetchWorkerTimes: (jobId,workerId) => dispatch(actions.fetchWorkerTimes(jobId,workerId)),
	//fetchAnswers: (jobId,workerId) => dispatch(actions.fetchAnswers(jobId,workerId)),
	fetchWorkers: jobId => dispatch(actions.fetchWorkers(jobId)),
	fetchTasksAgreements: jobId => dispatch(actions.fetchTasksAgreements(jobId)),
	//fetchWorkersAgreements: jobId => dispatch(actions.fetchWorkersAgreements(jobId)),
	//fetchMetric : metric => dispatch(actions.fetchMetric(metric)),
	fetchCrowdGolds: jobId => dispatch(actions.fetchCrowdGolds(jobId)),
	fetchWorkersPairs: jobId => dispatch(actions.fetchWorkersPairs(jobId)),
	fetchSingleWorker: (jobId,workerId) => dispatch(actions.fetchSingleWorker(jobId,workerId)),
	fetchJobStats: jobId => dispatch(actions.fetchJobStats(jobId)),
	fetchContribution: jobId => dispatch(actions.fetchContribution(jobId))
})

const mapStateToProps = state => ({
	reports: state.report.list.reports,
	rep_error: state.report.list.error,
	rep_loading: state.report.list.loading,

	workers: state.report.wlist.workers,
	worker_error: state.report.wlist.error,
	worker_loading: state.report.wlist.loading,

	/*single: state.report.single_list.reports,
	single_error: state.report.single_list.error,
	single_loading: state.report.single_list.loading,*/
})

export default connect(mapStateToProps,mapDispatchToProps)(Reports)
