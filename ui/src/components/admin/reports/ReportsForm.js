import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Redirect, Link} from 'react-router-dom';
import DataTable from 'src/components/core/table/DataTable';
import {ExperimentStatus} from 'src/utils/constants';
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
import { actions as projectactions } from '../projects/actions';
import { actions as expactions } from '../experiments/actions';

var ProjectOptions = { }

var JobOptions = { }

const options = {
  columns: {
    name: {
      label: 'Name',
      renderer(item) {
        return item.data.name;
      }
    },
    created_at: {
      label: 'Date created'
    }
  }
}

class ReportsForm extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			chosenproject : '',
			chosenjob : '',
			activejob: false,
			activechart: false
		}
		this.chooseProject = this.chooseProject.bind(this)
		this.chooseJob = this.chooseJob.bind(this)
	}

	componentDidMount() {
		//fetch projects as in the 'Projects' tab
    this.props.fetchProjects();
    //console.log(this.props.projects.rows)
    
    //map fetched project in option to choose for the reports
    this.props.projects.rows.map( step => {
    	ProjectOptions[step.id] = step.data.name+" ( "+step.created_at+" ) "
    })
    //console.log(this.state)
  }

  chooseProject(e, {value}) {
  	this.setState({
  		...this.state,
			chosenproject: value,
			chosenjob: '',
			activejob: true
		})
  	this.props.fetchExperiments(value);
  }

  chooseJob(e, {value}) {
  	this.setState({
			...this.state, 
			chosenjob: value,
			activechart: true
		})
  }

	render() {

		JobOptions = { }
    this.props.experiments.rows.map( step => {
      JobOptions[step.id] = step.data.name
    });

		return(
			<div>
				<DataTable
					title="Reminder of My Projects"
        	options={options}
        	data={this.props.projects.rows}
        	loading={this.props.loading}
      	/>

			<div style={{margin: '20px'}}>
      	<h3 style={{color: 'steelblue'}}>Chosen Project_id, Job_id =   {this.state.chosenproject}, {this.state.chosenjob}</h3>

				<Form.Select 
					style={{margin: '10px'}}
					label="Select Project  "
        	value={this.state.chosenproject}
					options={Object.entries(ProjectOptions).map(([key, val]) => ({text: val, value: key}))}
					onChange={this.chooseProject}
				/>

				<Form.Select 
					disabled={!this.state.activejob}
					style={{margin: '10px'}}
					label="Select Job  "
        	value={this.state.chosenjob}
					options={Object.entries(JobOptions).map(([key, val]) => ({text: val, value: key}))}
					onChange={this.chooseJob}
				/>

				<div style={{textAlign: 'center'}}>
				<Link to={`/admin/reports/${this.state.chosenproject}/${this.state.chosenjob}`}>
					<Button className='btn primary' 
                  disabled={!this.state.activechart}
                  >See Charts</Button>
				</Link>
				</div>

				</div>
			</div>
		);
	}
}

ReportsForm.propTypes = {
  fetchProjects: PropTypes.func,
  error: PropTypes.object,
  loading: PropTypes.bool,
  projects: PropTypes.object,

  fetchExperiments: PropTypes.func,
  eerror: PropTypes.any,
  eloading: PropTypes.bool,
  experiments: PropTypes.object,
  match: PropTypes.object
}

const mapStateToProps = state => ({
  projects: state.project.list.projects,
  error: state.project.list.error,
  loading: state.project.list.loading,

  experiments: state.experiment.list.experiments,
  eerror: state.experiment.list.error,
  eloading: state.experiment.list.loading
})

const mapDispatchToProps = dispatch => ({
  fetchProjects: () => dispatch(projectactions.fetchProjects()),
  fetchExperiments: projectId => dispatch(expactions.fetchExperiments(projectId))
})

export default connect(mapStateToProps,mapDispatchToProps)(ReportsForm)