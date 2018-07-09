import React from 'react';
import PropTypes from 'prop-types';
import {Grid, Button} from 'semantic-ui-react';
import {connect} from 'react-redux';

import {JobStatus, ShortestRunStatus} from 'src/utils/constants';
import {actions as srActions} from './shortest-run-actions';
import {
  StopButton,
  PublishButton,
  UpdateParametersButton,
  JobDashboardButtonsPropTypes
} from 'src/components/admin/jobs/JobDashboardButtons';
import {actions} from 'src/components/admin/jobs/actions';
import {isExpertMode} from 'src/utils';

class JobDashboardButtonsShortestRun extends React.Component {
  render() {
    return (
      <Grid.Row>
        <Grid.Column>
          <RunButton {...this.props} />
          <StopButton {...this.props} />
          {canUpdate(this.props.job, this.props.jobState) && <UpdateParametersButton {...this.props} />}
          {canRecomputeEstimations(this.props.job, this.props.jobState, this.props.estimationsPolling) && (
            <ComputeEstimationsButton {...this.props} />
          )}
        </Grid.Column>
      </Grid.Row>
    );
  }
}

const RunButton = ({job, jobState, publish, assignFilters, generateBaseline}) => {
  if (canPublish(job, jobState)) {
    return <PublishButton job={job} jobState={jobState} publish={publish} />;
  }

  if (
    jobState.taskAssignmentApi === ShortestRunStatus.ASSIGN_FILTERS ||
    jobState.taskAssignmentApi === ShortestRunStatus.UPDATED
  ) {
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

const ComputeEstimationsButton = ({job, computeJobEstimations, profile}) => {
  const single = !isExpertMode(profile);
  return (
    <Button onClick={() => computeJobEstimations(job.id, single)} floated="right" size="large" color="blue">
      Recompute estimations
    </Button>
  );
};

ComputeEstimationsButton.propTypes = {
  job: PropTypes.object,
  computeJobEstimations: PropTypes.func,
  profile: PropTypes.object
};

/**
 * This method checks if we can publish to AMT, and it adds conditions specific to ShortestRun.
 *
 * @param {Object} job
 * @param {Object} state
 * @return {Boolean}
 */
const canPublish = (job, state) => {
  if (!state.taskAssignmentApi) {
    return job.data.status === JobStatus.NOT_PUBLISHED;
  }
  // for shortest run
  return (
    job.data.status === JobStatus.NOT_PUBLISHED &&
    (state.taskAssignmentApi === ShortestRunStatus.FILTERS_ASSIGNED ||
      state.taskAssignmentApi === ShortestRunStatus.BASELINE_GENERATED)
  );
};

const canUpdate = (job, state) => {
  return (
    job.data.status === JobStatus.NOT_PUBLISHED &&
    (state.taskAssignmentApi === ShortestRunStatus.FILTERS_ASSIGNED ||
      state.taskAssignmentApi === ShortestRunStatus.INITIAL)
  );
};

const canRecomputeEstimations = (job, state, estimationsPolling) => {
  return canUpdate(job, state) && !estimationsPolling;
};

JobDashboardButtonsShortestRun.propTypes = {
  ...JobDashboardButtonsPropTypes,
  publish: PropTypes.func,
  computeJobEstimations: PropTypes.func
};

const mapStateToProps = state => ({
  profile: state.profile.item
});

const mapDispatchToProps = dispatch => ({
  assignFilters: jobId => dispatch(srActions.assignFilters(jobId)),
  generateBaseline: jobId => dispatch(srActions.generateBaseline(jobId)),
  computeJobEstimations: (jobId, single) =>
    dispatch(actions.computeJobEstimations(jobId, single, () => actions.pollJobEstimationsStatus(jobId)))
});

export default connect(mapStateToProps, mapDispatchToProps)(JobDashboardButtonsShortestRun);
