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
import { Button, Dimmer, Loader, Item, Form } from 'semantic-ui-react';

import './reports.css';
import { actions } from './actions';

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
			case 'W_CompleteTime':
				this.props.reports.tasks=[]
				this.props.fetchWorkerTimes(this.props.match.params.jobid,Number(this.state.chosenworker))
				break;
			case 'Percentage':
				this.props.reports.tasks=[]
				this.props.fetchAnswers(this.props.match.params.jobid,Number(this.state.chosenworker))
				break;
			case 'Distribution':
				this.props.reports.tasks=[]
				this.props.fetchTasksAgreements(this.props.match.params.jobid)
				break;
			case 'Classification':
				this.props.reports.tasks=[]
				this.props.fetchWorkersAgreements(this.props.match.params.jobid);
				break;
			case 'Correlations':
				this.props.reports.tasks=[]
				this.props.fetchMetric('ww/job/'+this.props.match.params.jobid+'/stats');
				break;
			case 'M2':
				this.props.reports.tasks=[]
				this.props.fetchMetric('worker/'+this.state.chosenworker+'/job/'+this.props.match.params.jobid+'/stats');
				break;
			default:
				console.log('Metric to implement: ', value)
				break;
		}

		this.setState({
			...this.state,
			chosenmetric: value,
			activeworker: value==='W_CompleteTime'||value==='Percentage' ? true : false,
			chosenworker: value==='W_CompleteTime'||value==='Percentage' ? this.state.chosenworker : 'all',
			chosenitem: value==='Classification' ? this.state.chosenitem : 'all',
			chosencriteria: value==='Classification'||value==='Percentage' ? this.state.chosencriteria : 'all',
			activeitem: value==='Classification' ? true : false,
			activecriteria: value==='Percentage' ? true : false
		})
	}

	chooseWorker(e, {value}) {
		switch(this.state.chosenmetric) {
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

renderChart(chart,x,y,z,param) {
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
				param={param}
				data={Object.values(this.props.reports.tasks)}
      />
      </div>
		)
	}

	render() {
		console.log(this.props.reports.tasks)

		//refresh options for charts with new loaded data every time
		var WorkerOptions =  { 'all' : 'All Workers' }
		Object.values(this.props.workers.workers).map( step => {
      WorkerOptions[step.worker_id] = step.turk_id
		});

		var ItemOptions = { 'all': 'All Items' }
		Object.values(this.props.reports.tasks).map( step => {
      ItemOptions[step.item_id] = step.item_id
		});

		var CritOptions = { 'all' : 'All Criteria' }
		Object.values(this.props.reports.tasks).map( step => {
      CritOptions[step.criteria_id] = step.criteria_id
		});

		var MetricOptions = {
			'cohen': "Cohen's Kappa",
			'm1': "Basic Agreement [ M1 ]",
			'wwm2': "Correlation in Errors [ WWM2 ]",
			'compare': "Comparing Cohen's Kappa and M1"
		}
		//parameters for reusable charts
		var chart //to define kind of chart
		var x //first group_by
		var y //categories
		var z //second group_by if necessary
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

			case 'W_CompleteTime':
				chart='nest'
				x='item_id'
				y='avgtime_ms'
				z='criteria_id'
				param=1000
				break;

			case 'Distribution':
				chart='stacked'
				x='item_id'
				y=''
				z='criteria_id'
				param=['yes','no','not clear']
				break;

			case 'Percentage':
				chart='pie'
				x='id'
				y='answer'
				z=['item_id','criteria_id']
				param=this.state.chosencriteria
				break;

			case 'Classification' :
				chart='linechart'
				x='worker_id'
				y='answer'
				z=['yes','no','not clear']
				param=[this.state.chosenitem,this.state.chosencriteria]
				break;

			case 'Correlations':
				x=''
				y=''
				z=''
				param=1
				break;

			case 'cohen':
				chart='heatmap'
				x='worker A'
				y='worker B'
				z='cohen\'s kappa correlation'
				param=1
				break;

			case 'm1':
				chart='heatmap'
				x='worker A'
				y='worker B'
				z='m1'
				param=1
				break;

			case 'wwm2':
				chart='heatmap'
				x='worker A'
				y='worker B'
				z='wwm2'
				param=1
				break;
			
			case 'WWM1':
				chart='heatmap'
				x='worker A'
				y='worker B'
				z='wwm1'
				param=100
				break;

			case 'M2':
				chart='histogram'
				x='m2'
				y='worker A'
				z=''
				param=1
				break;

			case 'compare':
				chart='linemetricchart'
				x=['worker A','worker B']
				y="cohen's kappa correlation"
				z="m1"
				param=1
				break;

			default:
				break;
		}

		return(
			<div style={{margin: '20px'}}>

				<div className="rowC">
				<h3 style={{color: 'steelblue'}}>
					Selected Job_id: <i>{this.props.match.params.jobid}</i><br />
					Selected Worker_id: <i>{this.state.chosenworker}</i><br />
					Selected Item_id: <i>{this.state.chosenitem}</i><br />
					Selected Criteria_id: <i>{this.state.chosencriteria}</i>
				</h3>

				<div style={{width: "20%"}}></div>

				<div>
				<WorkerChooser 
					disabled={(!this.state.activeworker)}
					options={WorkerOptions}
					onChange={this.chooseWorker}
					chosenworker={this.state.chosenworker}
				/>
				<ItemChooser 
					disabled={(!this.state.activeitem)}
					options={ItemOptions}
					onChange={this.chooseItem}
					chosenitem={this.state.chosenitem}
				/>
				<CritChooser 
					disabled={(!this.state.activecriteria)}
					options={CritOptions}
					onChange={this.chooseCriteria}
					chosencriteria={this.state.chosencriteria}
				/>
				</div>
				</div>

				<hr />
				<div className="rowC">
				<div className='options'>
					<MetricMenu onChange={this.chooseMetric}/>
					{
						(this.state.chosenmetric=="cohen"
						||this.state.chosenmetric=="m1"
						||this.state.chosenmetric=="wwm2"
						||this.state.chosenmetric=="Correlations"
						||this.state.chosenmetric=="compare") && 
						<div className='row' style={{'display': 'flex'}}>
							<br />
							<MetricChooser 
								options={MetricOptions}
								onChange={this.chooseMetric}
								chosenmetric={this.state.chosenmetric}
							/>
							<br />
						</div>
					}
				</div>
				{this.renderChart(chart,x,y,z,param)}
				</div>

			
			</div>
		);
	}
}

Reports.propTypes = {
	fetchTaskTime: PropTypes.func,
	fetchWorkers: PropTypes.func,
	fetchAnswers: PropTypes.func,
	fetchWorkerTimes: PropTypes.func,
	fetchTasksAgreements: PropTypes.func,
	fetchWorkersAgreements: PropTypes.func,

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
	fetchWorkerTimes: (jobId,workerId) => dispatch(actions.fetchWorkerTimes(jobId,workerId)),
	fetchAnswers: (jobId,workerId) => dispatch(actions.fetchAnswers(jobId,workerId)),
	fetchWorkers: jobId => dispatch(actions.fetchWorkers(jobId)),
	fetchTasksAgreements: jobId => dispatch(actions.fetchTasksAgreements(jobId)),
	fetchWorkersAgreements: (jobId) => dispatch(actions.fetchWorkersAgreements(jobId)),
	fetchMetric : (metric) => dispatch(actions.fetchMetric(metric))
})

const mapStateToProps = state => ({
	reports: state.report.list.reports,
	rep_error: state.report.list.error,
	rep_loading: state.report.list.loading,

	workers: state.report.wlist.workers,
	worker_error: state.report.wlist.error,
	worker_loading: state.report.wlist.loading
})

export default connect(mapStateToProps,mapDispatchToProps)(Reports)
