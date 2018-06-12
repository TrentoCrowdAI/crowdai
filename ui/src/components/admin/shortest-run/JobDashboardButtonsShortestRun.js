import React from 'react';
import PropTypes from 'prop-types';
import {Grid, Button} from 'semantic-ui-react';
import {connect} from 'react-redux';

import {JobStatus, ShortestRunStatus} from 'src/utils/constants';
import {actions as srActions} from './shortest-run-actions';
import {StopButton, PublishButton, UpdateParametersButton} from 'src/components/admin/jobs/JobDashboardButtons';

class JobDashboardButtonsShortestRun extends React.Component {
  render() {
    return (
      <Grid.Row>
        <Grid.Column>
          <RunButton {...this.props} />
          <StopButton {...this.props} />
          <UpdateParametersButton {...this.props} />
        </Grid.Column>
      </Grid.Row>
    );
  }
}

const RunButton = ({job, jobState, publish, assignFilters, generateBaseline}) => {
  if (canPublish(jobState)) {
    return <PublishButton job={job} jobState={jobState} publish={publish} />;
  }

  if (jobState.taskAssignmentApi === ShortestRunStatus.ASSIGN_FILTERS) {
    return (
      <Button onClick={() => assignFilters(job.id)} floated="right" size="large" positive>
        Run: assign filters
      </Button>
    );
  }

  if (jobState.taskAssignmentApi === ShortestRunStatus.INITIAL) {
    return (
      <Button onClick={() => generateBaseline(job.id)} floated="right" size="large" positive>
        Run: generate tasks for baseline
      </Button>
    );
  }
  return null;
};

RunButton.propTypes = {
  jobState: PropTypes.object,
  job: PropTypes.object,
  publish: PropTypes.func,
  assignFilters: PropTypes.func,
  generateBaseline: PropTypes.func
};

/**
 * This method checks if we can publish to AMT, and it adds conditions specific to ShortestRun.
 *
 * @param {Object} state
 * @return {Boolean}
 */
const canPublish = state => {
  if (!state.taskAssignmentApi) {
    return state.job === JobStatus.NOT_PUBLISHED;
  }
  // for shortest run
  return (
    state.job === JobStatus.NOT_PUBLISHED &&
    (state.taskAssignmentApi === ShortestRunStatus.FILTERS_ASSIGNED ||
      state.taskAssignmentApi === ShortestRunStatus.BASELINE_GENERATED)
  );
};

JobDashboardButtonsShortestRun.propTypes = {
  jobState: PropTypes.object,
  job: PropTypes.object,
  expertMode: PropTypes.bool,
  publish: PropTypes.func
};

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  assignFilters: jobId => dispatch(srActions.assignFilters(jobId)),
  generateBaseline: jobId => dispatch(srActions.generateBaseline(jobId))
});

export default connect(mapStateToProps, mapDispatchToProps)(JobDashboardButtonsShortestRun);
