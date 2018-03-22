import React from 'react'
import { connect } from 'react-redux'

import ChartWrapper from 'src/components/charts/ChartWrapper'

class Reports extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			type : '',
			chart: "no data to display"
		}
	}

	componentDidMount() {
		switch(this.props.match.url) {
			case '/admin/reports/complete_time':
				this.setState({
					type : "Time to Complete a Task",
					chart: <ChartWrapper chart='histogram'
            x={'peso'}
            y={'altezza'}
            selector={'chart1'}
            color={'blue'}/>
				})
				break;
			case '/admin/reports/succ_percentage' :
				this.setState({
					type : "Percentage of Success",
					chart : <ChartWrapper chart='linechart'
            x={'peso'}
            y={'altezza'}
            selector={'chart2'}
            color={'red'}/>
				})
				break;
			case '/admin/reports/agreements' : 
				this.setState({
					type : "Agreement Percentage",
					chart: <ChartWrapper chart='linechart'
            x={'altezza'}
            y={'peso'}
            selector={'chart3'}
            color={'darkgreen'}/>
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
				{this.state.chart}
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
