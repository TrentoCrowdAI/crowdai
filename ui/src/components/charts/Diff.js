import React from 'react'
import * as d3 from 'd3'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import ChartWrapper from './ChartWrapper'

class Diff extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return(
			<div>
				<ChartWrapper chart='histogram'/>
				<hr />
				<ChartWrapper chart='linechart'/>
			</div>
		)
	}

}

Diff.propTypes = {

}

const mapStateToProps = state => ({

})

const mapDispatchToProps = dispatch => ({

})

export default connect (mapStateToProps,mapDispatchToProps)(Diff)
