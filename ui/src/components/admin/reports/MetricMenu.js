import React from 'react';
import {connect} from 'react-redux';
//import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import './reports.css';
//import { actions } from './actions';

class MetricMenu extends React.Component {

	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this)
	}

	handleClick(e, {value}) {
		//highlight button of selected metric
		var buttons = document.getElementsByClassName('metrics')
		for (var x in buttons) {
			if(buttons[x].value===value)
				buttons[x].className!=undefined ? buttons[x].className += ' primary' : null
			else 
				buttons[x].className!=undefined ? buttons[x].className='ui button metrics' : null
		}

		this.props.onChange(e, {value})
	}

  render() {
    return(
			<React.Fragment>
				<strong style={{'color': '#2185d0'}}>Job Reports:</strong>
				<br />
				<Button 
					value='T_CompleteTime'
					className='metrics'
					style={{marginBottom: '5px'}}
					onClick={this.handleClick}
				>Time to Complete per Task</Button>
				<br />
				<Button 
					value='Distribution'
					className='metrics' 
					style={{marginBottom: '5px'}}
					onClick={this.handleClick}
				>Votes Distribution per Task</Button>
				<br />
				<Button 
					value='SingleWorker'
					className='metrics'
					style={{marginBottom: '5px'}}
					onClick={this.handleClick}
				>Single Worker Metrics</Button>	
				<br />
				<Button 
					value='Classification'
					className='metrics' 
					style={{marginBottom: '5px'}}
					onClick={this.handleClick}
				>Items Classification Tree</Button>
				<br />
				<strong style={{'color': '#2185d0'}}>Correlation Metrics:</strong> 
				<br />
				<Button 
					value='Global'
					className='metrics' 
					style={{marginBottom: '5px'}}
					onClick={this.handleClick}
				>Job Classification Efficiency</Button>
				<br />
				<Button 
					value='TwoWorkers'
					className='metrics'
					style={{marginBottom: '5px'}}
					onClick={this.handleClick}
				>Worker-Worker Metrics</Button>	
				<br />
				<Button 
					value='Contribution'
					className='metrics' 
					style={{marginBottom: '5px'}}
					onClick={this.handleClick}
				>Percentage contribution to Crowd Error</Button>
				<br />
			</React.Fragment>
    )
  }
}

const mapStateToProps = state => ({

})

const mapDispatchToProps = dispatch => ({

})

export default connect (mapStateToProps,mapDispatchToProps)(MetricMenu)