import React from 'react'
import { connect } from 'react-redux'

class Reports extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			type : ''
		}
	}

	componentDidMount() {
		switch(this.props.match.url) {
			case '/admin/reports/complete_time':
				this.setState({
					type : "Time to Complete a Task"
				})
				break;
			case '/admin/reports/succ_percentage' :
				this.setState({
					type : "Percentage of Success"
				})
				break;
			case '/admin/reports/agreements' : 
				this.setState({
					type : "Agreement Percentage"
				})
				break;
			default : 
				this.setState({
					type : "Report Type"
				})
				break;
		}
	}

	render() {
		return(
			<div style={{margin: '20px'}}>
				<h2>{this.state.type}</h2>
			</div>
		);
	}
}

Reports.propTypes = {

}

const mapDispatchToProps = dispatch => ({

})

const mapStateToProps = state => ({

})

export default connect(mapStateToProps,mapDispatchToProps)(Reports)
