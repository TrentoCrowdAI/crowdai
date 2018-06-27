import React from 'react';
import {connect} from 'react-redux';
//import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import './reports.css';
//import { actions } from './actions';

class MetricMenu extends React.Component {

  render() {
    return(
			<React.Fragment>
				<strong style={{'color': 'steelblue'}}>Job Reports:</strong>
				<br />
				<Button 
					value='T_CompleteTime'
					className='metrics'
					style={{marginBottom: '5px'}}
					onClick={this.props.onChange}
				>Time to Complete per Task</Button>
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
				>Items Classification Tree</Button>
				<br />
				<strong style={{'color': 'steelblue'}}>Correlation Metrics [ Reporting API ]:</strong> 
				<br />
				<Button 
					value='Global'
					className='metrics' 
					style={{marginBottom: '5px'}}
					onClick={this.props.onChange}
				>Job Classification Efficiency</Button>
				<br />
				<Button 
					value='TwoWorkers'
					className='metrics'
					style={{marginBottom: '5px'}}
					onClick={this.props.onChange}
				>Worker-Worker Metrics</Button>	
				<br />
				<Button 
					value='SingleWorker'
					className='metrics'
					style={{marginBottom: '5px'}}
					onClick={this.props.onChange}
				>Single Worker Metrics</Button>	
				<br />
				<Button 
					value='M2'
					className='metrics' 
					style={{marginBottom: '5px'}}
					onClick={this.props.onChange}
				>Percentage contribution to Crowd Error</Button>
				<br />
			</React.Fragment>
    )
  }
}

/**
 * <Button 
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
				<Button 
					value='prova'
					className='metrics' 
					style={{marginBottom: '5px'}}
					onClick={this.props.onChange}
				>Cohen's Kappa vs M1</Button>
				<br />
				
				<Button 
					value='W_CompleteTime'
					className='metrics'
					style={{marginBottom: '5px'}}
					onClick={this.props.onChange}
				>Time to Complete per Worker</Button>
				<br />
 */

/**
 * <Button 
					value='WWM1'
					className='metrics' 
					style={{marginBottom: '5px'}}
					onClick={this.props.onChange}
				>Basic Agreement between Workers<br />[ WWM1 ]</Button>
				<br />
				<Button 
					value='Percentage'
					className='metrics' 
					style={{marginBottom: '5px'}}
					onClick={this.props.onChange}
				>Votes Distribution per Worker</Button>
				<br />
				
 */

const mapStateToProps = state => ({

})

const mapDispatchToProps = dispatch => ({

})

export default connect (mapStateToProps,mapDispatchToProps)(MetricMenu)