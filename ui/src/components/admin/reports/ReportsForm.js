import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Redirect, Link} from 'react-router-dom';
import DataTable from 'src/components/core/table/DataTable';

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
import { actions } from '../projects/actions';

var ProjectOptions = {
  id1: 'Project title 1',
  id2: 'Project title 2',
  id3: 'Project title 3',
  id4: 'Project title 4'
}

var JobOptions = {
  jid1: 'Job title 1',
  jid2: 'Job title 2',
  jid3: 'Job title 3',
  jid4: 'Job title 4'
}

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

/*<Link to='/admin/reports/complete_time' ><Button
					style={{width: '50%', margin: '5px'}}
					>Time to comlplete a Task</Button></Link>
				<br />
				<Link to='/admin/reports/succ_percentage' ><Button
					style={{width: '50%', margin: '5px'}}
					>Percentage % of success</Button></Link>
				<br />
				<Link to='/admin/reports/agreements' ><Button
					style={{width: '50%', margin: '5px'}}
					>Agreement Reports</Button></Link>
				<br />
				<Link to='/admin/reports/others' ><Button
					style={{width: '50%', margin: '5px'}}
					>...</Button></Link>*/

class ReportsForm extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			chosenproject : 'id1',
			chosenjob : 'jid1',
			activejob: false,
			activechart: false
		}
	}

	componentDidMount() {
    this.props.fetchProjects();
    console.log(this.props.projects.rows)

    //project options to be mapped 
    //job options to be mapped
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
      	<h3 
      		style={{color: 'steelblue'}}
      	>Choose a Project</h3>

				<Form.Select 
					style={{margin: '10px'}}
					label="Select Project  "
        	value={this.state.chosenproject}
					options={Object.entries(ProjectOptions).map(([key, val]) => ({text: val, value: key}))}
					onChange={(e, {value}) => this.setState({
						...this.state, 
						chosenproject: value,
						activejob: true
					})
					//fetch jobs per project selected
				}
				/>

				<Form.Select 
					disabled={!this.state.activejob}
					style={{margin: '10px'}}
					label="Select Job  "
        	value={this.state.chosenjob}
					options={Object.entries(JobOptions).map(([key, val]) => ({text: val, value: key}))}
					onChange={(e, {value}) => this.setState({
						...this.state, 
						chosenjob: value,
						activechart: true
					})}
				/>
				
				<br />
				<Link to={`/admin/reports/${this.state.chosenproject}/${this.state.chosenjob}`}>
					<Button 
					className='btn primary charts'>See Charts</Button>
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
  projects: PropTypes.shape({
    rows: PropTypes.arrayOf(PropTypes.object),
    meta: PropTypes.object
  })
}

const mapStateToProps = state => ({
  projects: state.project.list.projects,
  error: state.project.list.error,
  loading: state.project.list.loading
})

const mapDispatchToProps = dispatch => ({
  fetchProjects: () => dispatch(actions.fetchProjects())
})

export default connect(mapStateToProps,mapDispatchToProps)(ReportsForm)