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
				<ChartWrapper chart='histogram'
            x={'peso'}
            y={'altezza'}
            selector={'chart1'}
            color={'blue'}/>
				<hr />
				<ChartWrapper chart='linechart'
            x={'peso'}
            y={'altezza'}
            selector={'chart2'}
            color={'red'}/>
				<hr />
				<ChartWrapper chart='heatmap'
              x={'peso'}
              y={'altezza'}
              selector={'chart3'}
              color={'green'}/>
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
