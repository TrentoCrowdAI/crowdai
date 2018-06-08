import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import ChartWrapper from 'src/components/charts/ChartWrapper';
import JobChooser from './JobChooser';
import WorkerChooser from './WorkerChooser';
import ItemChooser from './ItemChooser';
import CritChooser from './CritChooser';
import { Button, Dimmer, Loader, Item, Form } from 'semantic-ui-react';
import './reports.css';

import { actions } from './actions';

class MetricMenu extends React.Component {

  render() {
    return(
			<div className="options">
				Available Reports:
				<br />
				<Button 
					value='T_CompleteTime'
					className='metrics'
					style={{marginBottom: '5px'}}
					onClick={this.props.onChange}
				>Time to complete per Job</Button>
				<br />
				<Button 
					value='W_CompleteTime'
					className='metrics'
					style={{marginBottom: '5px'}}
					onClick={this.props.onChange}
				>Time to complete per Worker</Button>
				<br />
				<Button 
					value='Percentage'
					className='metrics' 
					style={{marginBottom: '5px'}}
					onClick={this.props.onChange}
				>Percentage % of Votes</Button>
				<br />
				<Button 
					value='Distribution'
					className='metrics' 
					style={{marginBottom: '5px'}}
					onClick={this.props.onChange}
				>Votes Distribution per Task</Button>
				<br />
				<Button 
					value='Classification'
					className='metrics' 
					style={{marginBottom: '5px'}}
					onClick={this.props.onChange}
				>Task Classification and Worker Agreement</Button>
				<br />
				Correlation Metrics: 
				<br />
				<Button 
					value='Cohen'
					className='metrics' 
					style={{marginBottom: '5px'}}
					onClick={this.props.onChange}
				>Cohen's Kappa between Workers</Button>
				<br />
				<Button 
					value='M1'
					className='metrics' 
					style={{marginBottom: '5px'}}
					onClick={this.props.onChange}
				>Inter-Worker Agreement<br />[ M1 ]</Button>
				<br />
				<Button 
					value='M2'
					className='metrics' 
					style={{marginBottom: '5px'}}
					onClick={this.props.onChange}
				>Percentage contribution to Crowd Error<br />[ M2 ]</Button>
				<br />
				<Button 
					value='WWM2'
					className='metrics' 
					style={{marginBottom: '5px'}}
					onClick={this.props.onChange}
				>Conditional Error Propability <br /> P_err(A|B)<br />[ WWM2 ]</Button>
				<br />
			</div>
    )
  }
}

/**
 * <Button 
					value='WWM1'
					className='metrics' 
					style={{marginBottom: '5px'}}
					onClick={this.props.onChange}
				>Basic Agreement between Workers<br />[ WWM1 ]</Button>
				<br />
 */

const mapStateToProps = state => ({

})

const mapDispatchToProps = dispatch => ({

})

export default connect (mapStateToProps,mapDispatchToProps)(MetricMenu)