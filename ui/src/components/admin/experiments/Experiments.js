import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {Button, Icon, Popup} from 'semantic-ui-react';

import {actions} from './actions';
import DataTable from 'src/components/core/table/DataTable';
import {ExperimentStatus} from 'src/utils/constants';

// configuration options for our DataTable.
const options = {
  columns: {
    uuid: {
      label: 'UUID'
    },
    name: {
      label: 'Name',
      key: 'data.name'
    },
    status: {
      label: 'Status',
      key: 'data.status'
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
          {item.data.status === ExperimentStatus.NOT_PUBLISHED && (
            // <Popup
            //   trigger={
            //     <Button icon color="blue" size="mini" as={Link} to={`/admin/experiments/${item.id}/publish`}>
            //       <Icon name="play" />
            //     </Button>
            //   }
            //   content="Publish your experiment on Mechanical Turk"
            // />
            <Button
              icon
              color="blue"
              size="mini"
              as={Link}
              to={`/admin/projects/${item.project_id}/screenings/${item.id}/edit`}>
              <Icon name="edit" />
            </Button>
          )}
          <Button
            icon
            color="blue"
            size="mini"
            as={Link}
            to={`/admin/projects/${item.project_id}/screenings/${item.id}/dashboard`}>
            <Icon name="play" />
          </Button>
        </React.Fragment>
      );
    }
  }
};

class Experiments extends React.Component {
  render() {
    return (
      <DataTable
        title="My jobs"
        options={options}
        data={this.props.experiments.rows}
        createUrl={`${this.props.match.url}/new`}
        loading={this.props.loading}
      />
    );
  }

  componentDidMount() {
    this.props.fetchExperiments(Number(this.props.match.params.projectId));
  }
}

Experiments.propTypes = {
  fetchExperiments: PropTypes.func,
  error: PropTypes.any,
  loading: PropTypes.bool,
  experiments: PropTypes.object,
  match: PropTypes.object
};

const mapStateToProps = state => ({
  experiments: state.experiment.list.experiments,
  error: state.experiment.list.error,
  loading: state.experiment.list.loading
});

const mapDispatchToProps = dispatch => ({
  fetchExperiments: projectId => dispatch(actions.fetchExperiments(projectId))
});

export default connect(mapStateToProps, mapDispatchToProps)(Experiments);
