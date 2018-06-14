import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import DataTable from 'src/components/core/table/DataTable';
import {
  Form,
  Button
} from 'semantic-ui-react';
import { actions as jobactions } from '../jobs/actions';

var ProjectOptions = { }

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
			activechart: false
		}
		this.chooseProject = this.chooseProject.bind(this)
	}

	componentDidMount() {
    this.props.fetchJobs();

    this.props.projects.rows.map( step => {
    	ProjectOptions[step.id] = step.data.name+" ( "+step.created_at+" ) "
    })
  }

  chooseProject(e, {value}) {
  	this.setState({
  		...this.state,
			chosenproject: value,
			activechart: true
		})
  }

	render() {
    
    //console.log(this.state)

		return(
			<div>
				<DataTable
					title="My Projects"
        	options={options}
        	data={this.props.projects.rows}
        	loading={this.props.loading}
      	/>

			<div style={{margin: '20px'}}>
      	<h3 style={{color: 'steelblue'}}>Chosen Project_id : {this.state.chosenproject}</h3>

				<Form.Select 
					style={{margin: '10px'}}
					label="Select Project  "
        	value={this.state.chosenproject}
					options={Object.entries(ProjectOptions).map(([key, val]) => ({text: val, value: key}))}
					onChange={this.chooseProject}
				/>

				<div style={{textAlign: 'center'}}>
				<Link to={`/admin/reports/${this.state.chosenproject}`}>
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
  projects: PropTypes.object
}

const mapStateToProps = state => ({
  projects: state.job.list.jobs,
  error: state.job.list.error,
  loading: state.job.list.loading
})

const mapDispatchToProps = dispatch => ({
  fetchJobs: () => dispatch(jobactions.fetchJobs())
})

export default connect(mapStateToProps,mapDispatchToProps)(ReportsForm)