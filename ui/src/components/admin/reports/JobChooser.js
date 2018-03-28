import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Redirect, Link} from 'react-router-dom';
import DataTable from 'src/components/core/table/DataTable';
import {ExperimentStatus} from 'src/utils/constants';
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
import { actions as projectactions } from '../projects/actions';
import { actions as expactions } from '../experiments/actions';

var JobOptions = {}

class JobChooser extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      chosen: ''
    }
  }

  componentDidMount() {
    this.props.fetchExperiments(this.state.chosenproject);
    this.props.experiments.rows.map( step => {
      JobOptions[step.id] = step.data.name
    });
  }

  /*componentDidUpdate() {
    JobOptions = {}
    this.props.fetchExperiments(this.state.chosenproject);
    this.props.experiments.rows.map( step => {
      JobOptions[step.id] = step.data.name
    });
  }*/

  render() {
    console.log(this.props)
    return(
      <React.Fragment>
      <Form.Select 
          disabled={this.props.active}
          style={{margin: '10px'}}
          label="Select Job  "
          value={this.state.chosen}
          options={Object.entries(JobOptions).map(([key, val]) => ({text: val, value: key}))}
          onChange={this.props.onChange}
        />
      </React.Fragment>
    );
  }

}

JobChooser.propTypes = {
  fetchExperiments: PropTypes.func,
  error: PropTypes.any,
  loading: PropTypes.bool,
  experiments: PropTypes.object,
  match: PropTypes.object
}

const mapStateToProps = state => ({
  experiments: state.experiment.list.experiments,
  error: state.experiment.list.error,
  loading: state.experiment.list.loading
})

const mapDispatchToProps = dispatch => ({
  fetchExperiments: projectId => dispatch(expactions.fetchExperiments(projectId))
})

export default connect(mapStateToProps,mapDispatchToProps)(JobChooser)