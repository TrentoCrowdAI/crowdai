import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Redirect, Link} from 'react-router-dom';
import {Button, Icon, Popup} from 'semantic-ui-react';

import {actions} from './actions';
import DataTable from 'src/components/core/table/DataTable';

const ACCOUNT_NOT_INITIALIZED = 'Requester account has not been initialized';

// configuration options for our DataTable.
const options = {
  columns: {
    id: {
      label: 'ID'
    },
    name: {
      label: 'Name'
    }
  },

  rowPositive(item) {
    return item.published;
  },

  actions: {
    label: 'Actions',
    renderer(item) {
      if (!item.published) {
        return (
          <Popup
            trigger={
              <Button icon color="blue" size="mini" as={Link} to={`/admin/experiments/${item.id}/publish`}>
                <Icon name="play" />
              </Button>
            }
            content="Publish your experiment on Mechanical Turk"
          />
        );
      }
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
