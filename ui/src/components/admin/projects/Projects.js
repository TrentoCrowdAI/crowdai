import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Redirect, Link} from 'react-router-dom';
import {Button, Icon} from 'semantic-ui-react';

import {actions} from './actions';
import DataTable from 'src/components/core/table/DataTable';
import {datetimeFormatter} from 'src/utils';

const ACCOUNT_NOT_INITIALIZED = 'Requester account has not been initialized';

class Projects extends React.Component {
  render() {
    if (this.props.error && this.props.error.message === ACCOUNT_NOT_INITIALIZED) {
      return <Redirect to="/admin/profile" />;
    }
    return (
      <DataTable
        title="My projects"
        options={getOptions(this.props)}
        data={this.props.projects.rows}
        createUrl="/admin/projects/new"
        loading={this.props.loading}
      />
    );
  }

  componentDidMount() {
    this.props.fetchProjects();
  }
}

/**
 * Returns the configuration options for the DataTable.
 *
 * @param {Object} props
 * @return {Object}
 */
const getOptions = props => {
  return {
    columns: {
      name: {
        label: 'Name',
        renderer(item) {
          return item.data.name;
        }
      },
      created_at: {
        label: 'Date created',
        renderer(item) {
          return datetimeFormatter(item.created_at);
        }
      }
    },

    actions: {
      label: 'Actions',
      renderer(item) {
        return (
          <React.Fragment>
            <Button icon color="blue" size="mini" as={Link} to={`/admin/projects/${item.id}/edit`}>
              <Icon name="edit" />
            </Button>
            <Button
              icon
              color="blue"
              size="mini"
              as={Link}
              to={`/admin/projects/${item.id}/screenings`}
              onClick={() => {
                // eslint-disable-next-line react/prop-types
                props.fetchItem(item.id);
              }}>
              <Icon name="list layout" />
            </Button>
          </React.Fragment>
        );
      }
    }
  };
};

Projects.propTypes = {
  fetchProjects: PropTypes.func,
  error: PropTypes.object,
  loading: PropTypes.bool,
  projects: PropTypes.shape({
    rows: PropTypes.arrayOf(PropTypes.object),
    meta: PropTypes.object
  }),
  fetchItem: PropTypes.func
};

const mapStateToProps = state => ({
  projects: state.project.list.projects,
  error: state.project.list.error,
  loading: state.project.list.loading
});

const mapDispatchToProps = dispatch => ({
  fetchProjects: () => dispatch(actions.fetchProjects()),
  fetchItem: id => dispatch(actions.fetchItem(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(Projects);
