import React from 'react'
import * as d3 from 'd3'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import ChartWrapper from './ChartWrapper'
import HeatMap from './HeatMap';

class Diff extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return(
			<div>
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
