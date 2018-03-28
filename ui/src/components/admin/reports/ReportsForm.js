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
import JobChooser from './JobChooser.js'

var ProjectOptions = { }

//var JobOptions = { }

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

    this.setState({
    	chosenproject: this.props.projects.rows[0].id
    })

    console.log(this.state)
  }

  chooseProject(e, {value}) {
  	this.setState({
  		...this.state,
			chosenproject: value,
			activejob: true
		})
  }

  chooseJob(e, {value}) {
  	this.setState({
			...this.state, 
			chosenjob: value,
			activechart: true
		})
  }

	render() {
		return(
			<div>
				<DataTable
					title="Reminder of My Projects"
        	options={options}
        	data={this.props.projects.rows}
        	loading={this.props.loading}
      	/>

			<div style={{margin: '20px'}}>
      	<h3 style={{color: 'steelblue'}}>Choose a Project  {this.state.chosenproject}, {this.state.chosenjob}</h3>

				<Form.Select 
					style={{margin: '10px'}}
					label="Select Project  "
        	value={this.state.chosenproject}
					options={Object.entries(ProjectOptions).map(([key, val]) => ({text: val, value: key}))}
					onChange={this.chooseProject}
				/>

				<JobChooser 
					active={!this.state.activejob}
					value={this.state.chosenjob}
					onChange={this.chooseJob}
				/>
				
				<br />
				<Link to={`/admin/reports/${this.state.chosenproject}/${this.state.chosenjob}`}>
					<Button className='btn primary'>See Charts</Button>
				</Link>

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
  experiments: PropTypes.object,
  match: PropTypes.object
}

const mapStateToProps = state => ({
  projects: state.project.list.projects,
  experiments: state.experiment.list.experiments,
  error: state.project.list.error,
  loading: state.project.list.loading
})

const mapDispatchToProps = dispatch => ({
  fetchProjects: () => dispatch(projectactions.fetchProjects()),
  fetchExperiments: projectId => dispatch(expactions.fetchExperiments(projectId))
})

export default connect(mapStateToProps,mapDispatchToProps)(ReportsForm)