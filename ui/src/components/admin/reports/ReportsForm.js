import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Redirect, Link} from 'react-router-dom';
import {Button, Icon} from 'semantic-ui-react';

import {actions} from './actions';



class ReportsForm extends React.Component {
	render() {
		return(
			<div style={{margin: '20px', textAlign: 'center'}}>
				<Link to='/admin/reports/complete_time' ><Button
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
					>...</Button></Link>
			</div>
		);
	}
}

ReportsForm.propTypes = {

}

const mapStateToProps = state => ({

})

const mapDispatchToProps = dispatch => ({

})

export default connect()(ReportsForm)