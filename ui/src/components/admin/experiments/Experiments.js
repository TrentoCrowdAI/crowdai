import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {actions} from './actions';

const ACCOUNT_NOT_INITIALIZED = 'Requester account has not been initialized';

class Experiments extends React.Component {
  render() {
    if (this.props.error && this.props.error.message === ACCOUNT_NOT_INITIALIZED) {
      return <h1>Please init your account!</h1>;
    }
    return <h1>Experiments</h1>;
  }

  componentDidMount() {
    this.props.fetchExperiments();
  }
}

Experiments.propTypes = {
  fetchExperiments: PropTypes.func,
  error: PropTypes.object
};

const mapStateToProps = state => ({
  experiments: state.experiment.experiments,
  error: state.experiment.error
});

const mapDispatchToProps = dispatch => ({
  fetchExperiments: () => dispatch(actions.fetchExperiments())
});

export default connect(mapStateToProps, mapDispatchToProps)(Experiments);
