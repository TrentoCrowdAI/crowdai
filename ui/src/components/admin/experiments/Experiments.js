import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Redirect} from 'react-router-dom';

import {actions} from './actions';
import DataTable from 'src/components/core/table/DataTable';

const ACCOUNT_NOT_INITIALIZED = 'Requester account has not been initialized';

const options = {
  columns: {
    id: {
      label: 'ID'
    },
    name: {
      label: 'Name'
    }
  }
};

class Experiments extends React.Component {
  render() {
    if (this.props.loading) {
      return <p>Loading...</p>;
    }
    if (this.props.error && this.props.error.message === ACCOUNT_NOT_INITIALIZED) {
      return <Redirect to="/admin/profile" />;
    }
    return (
      <DataTable
        title="My experiments"
        options={options}
        data={this.props.experiments}
        createUrl="/admin/experiments/new"
      />
    );
  }

  componentDidMount() {
    this.props.fetchExperiments();
  }
}

Experiments.propTypes = {
  fetchExperiments: PropTypes.func,
  error: PropTypes.object,
  loading: PropTypes.bool,
  experiments: PropTypes.arrayOf(PropTypes.object)
};

const mapStateToProps = state => ({
  experiments: state.experiment.list.experiments,
  error: state.experiment.error,
  loading: state.experiment.loading
});

const mapDispatchToProps = dispatch => ({
  fetchExperiments: () => dispatch(actions.fetchExperiments())
});

export default connect(mapStateToProps, mapDispatchToProps)(Experiments);
