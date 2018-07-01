import React from 'react';
import PropTypes from 'prop-types';
import {Grid, Button, Label, Popup} from 'semantic-ui-react';
import {connect} from 'react-redux';

import {JobStatus, RegisteredTaskAssignmentStrategies} from 'src/utils/constants';
import {actions} from './actions';
import JobDashboardButtonsShortestRun from 'src/components/admin/plugins/shortest-run/JobDashboardButtonsShortestRun';
import EstimatedCostDetails from './EstimatedCostDetails';
import {isExpertMode} from 'src/utils';

class JobDashboardButtons extends React.Component {
  render() {
    const {taskAssignmentStrategy} = this.props.job;

    if (!taskAssignmentStrategy) {
      return null;
    }
    return (
      <Grid.Row>
        <Grid.Column>
          {taskAssignmentStrategy.name === RegisteredTaskAssignmentStrategies.SHORTEST_RUN && (
            <JobDashboardButtonsShortestRun {...this.props} />
          )}
          {taskAssignmentStrategy.name === RegisteredTaskAssignmentStrategies.BASELINE && (
            <SimpleTaskAssignmentStrategyButtons {...this.props} />
          )}
        </Grid.Column>
      </Grid.Row>
    );
  }
}

/**
 * These are the buttons that are part of the very simple task assignment strategy.
 *
 * @param {Object} props
 * @return {JSX.Element}
 */
const SimpleTaskAssignmentStrategyButtons = props => {
  return (
    <React.Fragment>
      {canPublish(props.jobState) && <PublishButton {...props} />}
      <StopButton {...props} />
      <UpdateParametersButton {...props} />
    </React.Fragment>
  );
};

SimpleTaskAssignmentStrategyButtons.propTypes = {
  job: PropTypes.object,
  jobState: PropTypes.object
};

const PublishButton = ({publish, job}) => {
  return (
    <Button onClick={() => publish()} floated="right" as="div" labelPosition="right">
      <Button size="large" positive>
        Publish on AMT
      </Button>
      {job.estimatedCost && (
        <Popup
          trigger={
            <Label as="a" basic color="green" pointing="left">
              $ {job.estimatedCost.total.toFixed(2)}
            </Label>
          }
          content={<EstimatedCostDetails job={job} />}
        />
      )}
    </Button>
  );
};

PublishButton.propTypes = {
  publish: PropTypes.func,
  job: PropTypes.object
};

const StopButton = ({job}) => {
  if (job.data.status === JobStatus.PUBLISHED) {
    return (
      <Button floated="right" size="large" negative>
        Stop
      </Button>
    );
  }
  return null;
};
StopButton.propTypes = {
  job: PropTypes.object
};

const UpdateParametersButton = ({job, profile, selectedParameter, setInputValue, update}) => {
  if (isExpertMode(profile) && job.data.status === JobStatus.NOT_PUBLISHED && selectedParameter) {
    return (
      <Button
        floated="right"
        size="large"
        style={{width: '200px'}}
        onClick={() => {
          setInputValue('data.initialTestsRule', selectedParameter.worker_tests);
          setInputValue('data.votesPerTaskRule', selectedParameter.votes_per_item);
          update(job);
        }}>
        Update parameters
      </Button>
    );
  }
  return null;
};
UpdateParametersButton.propTypes = {
  job: PropTypes.object,
  profile: PropTypes.object,
  selectedParameter: PropTypes.object,
  update: PropTypes.func,
  setInputValue: PropTypes.func
};

/**
 * This method checks if we can publish to AMT.
 *
 * @param {Object} state
 * @return {Boolean}
 */
const canPublish = state => {
  return state.job === JobStatus.NOT_PUBLISHED;
};

/**
 * Standard prop-types for the JobDashboardButtons
 */
const JobDashboardButtonsPropTypes = {
  jobState: PropTypes.object,
  job: PropTypes.object,
  selectedParameter: PropTypes.object,
  estimationsPolling: PropTypes.bool,
  profile: PropTypes.object
};

JobDashboardButtons.propTypes = JobDashboardButtonsPropTypes;

const mapStateToProps = state => ({
  profile: state.profile.item,
  selectedParameter: state.job.selectedParameter.selected,
  estimationsPolling: state.job.jobEstimations.polling
});

const mapDispatchToProps = dispatch => ({
  publish: () => dispatch(actions.publish()),
  update: job => dispatch(actions.submit(false, () => actions.fetchItem(job.id))),
  setInputValue: (name, value) => dispatch(actions.setInputValue(name, value))
});

export default connect(mapStateToProps, mapDispatchToProps)(JobDashboardButtons);

export {PublishButton, StopButton, UpdateParametersButton, JobDashboardButtonsPropTypes};
