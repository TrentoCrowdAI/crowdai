import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Redirect, Link} from 'react-router-dom';
import {Button, Icon, Popup} from 'semantic-ui-react';

import {actions} from './actions';
import DataTable from 'src/components/core/table/DataTable';
import {ExperimentStatus} from 'src/utils/constants';

const ACCOUNT_NOT_INITIALIZED = 'Requester account has not been initialized';

// configuration options for our DataTable.
const options = {
  columns: {
    id: {
      label: 'ID'
    },
    name: {
      label: 'Name'
    },
    status: {
      label: 'Status'
    }
  },

  rowPositive(item) {
    return item.status === ExperimentStatus.PUBLISHED;
  },

  actions: {
    label: 'Actions',
    renderer(item) {
      return (
        <React.Fragment>
          {item.status === ExperimentStatus.NOT_PUBLISHED && (
            <Popup
              trigger={
                <Button icon color="blue" size="mini" as={Link} to={`/admin/experiments/${item.id}/publish`}>
                  <Icon name="play" />
                </Button>
              }
              content="Publish your experiment on Mechanical Turk"
            />
          )}
          <Button icon color="blue" size="mini" as={Link} to={`/admin/experiments/${item.id}/dashboard`}>
            <Icon name="setting" />
          </Button>
        </React.Fragment>
      );
    }
  }
};

class Experiments extends React.Component {
  render() {
    if (this.props.error && this.props.error.message === ACCOUNT_NOT_INITIALIZED) {
      return <Redirect to="/admin/profile" />;
    }
    return (
      <DataTable
        title="My experiments"
        options={options}
        data={this.props.experiments}
        createUrl="/admin/experiments/new"
        loading={this.props.loading}
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
  error: state.experiment.list.error,
  loading: state.experiment.list.loading
});

const mapDispatchToProps = dispatch => ({
  fetchExperiments: () => dispatch(actions.fetchExperiments())
});

export default connect(mapStateToProps, mapDispatchToProps)(Experiments);
