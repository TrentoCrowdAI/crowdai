import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {Button, Icon, Popup} from 'semantic-ui-react';

import {actions} from './actions';
import DataTable from 'src/components/core/table/DataTable';
import {JobStatus} from 'src/utils/constants';
import {datetimeFormatter} from 'src/utils';

class Jobs extends React.Component {
  render() {
    return (
      <DataTable
        title="My jobs"
        options={getOptions(this.props)}
        data={this.props.jobs.rows}
        createUrl={`${this.props.match.url}/new`}
        loading={this.props.loading || this.props.copyJobLoading}
      />
    );
  }

  componentDidMount() {
    this.props.fetchJobs(Number(this.props.match.params.projectId));
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
      date: {
        label: 'Created at',
        renderer(item) {
          return datetimeFormatter(item.created_at);
        }
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
      return item.data.status === JobStatus.PUBLISHED;
    },

    actions: {
      label: 'Actions',
      renderer(item) {
        return (
          <React.Fragment>
            {item.data.status === JobStatus.NOT_PUBLISHED && (
              <Button icon color="blue" size="mini" as={Link} to={`/admin/screenings/${item.id}/edit`}>
                <Icon name="edit" />
              </Button>
            )}
            <Button icon color="blue" size="mini" as={Link} to={`/admin/screenings/${item.id}/dashboard`}>
              <Icon name={item.data.status === JobStatus.NOT_PUBLISHED ? 'play' : 'eye'} />
            </Button>
            <Popup
              trigger={
                <Button
                  icon
                  color="blue"
                  size="mini"
                  onClick={() => {
                    // eslint-disable-next-line react/prop-types
                    props.copyJob(item.id);
                  }}>
                  <Icon name="copy" />
                </Button>
              }
              content="Copy this job"
            />
          </React.Fragment>
        );
      }
    }
  };
};

Jobs.propTypes = {
  fetchJobs: PropTypes.func,
  error: PropTypes.any,
  loading: PropTypes.bool,
  jobs: PropTypes.object,
  match: PropTypes.object,
  copyJob: PropTypes.func,
  copyJobLoading: PropTypes.bool
};

const mapStateToProps = state => ({
  jobs: state.job.list.jobs,
  error: state.job.list.error,
  loading: state.job.list.loading,
  copyJobLoading: state.job.copy.loading
});

const mapDispatchToProps = dispatch => ({
  fetchJobs: jobId => dispatch(actions.fetchJobs(jobId)),
  copyJob: jobId => dispatch(actions.copyJob(jobId))
});

export default connect(mapStateToProps, mapDispatchToProps)(Jobs);
