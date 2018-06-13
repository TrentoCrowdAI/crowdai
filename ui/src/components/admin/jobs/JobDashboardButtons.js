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
  constructor(props) {
    super(props);
  }
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

const UpdateParametersButton = ({job, profile}) => {
  if (isExpertMode(profile) && job.data.status === JobStatus.NOT_PUBLISHED) {
    return (
      <Button floated="right" size="large" style={{width: '200px'}}>
        Update parameters
      </Button>
    );
  }
  return null;
};
UpdateParametersButton.propTypes = {
  job: PropTypes.object,
  profile: PropTypes.object
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

JobDashboardButtons.propTypes = {
  jobState: PropTypes.object,
  job: PropTypes.object
};

const mapStateToProps = state => ({
  profile: state.profile.item
});

const mapDispatchToProps = dispatch => ({
  publish: () => dispatch(actions.publish())
});

export default connect(mapStateToProps, mapDispatchToProps)(JobDashboardButtons);

export {PublishButton, StopButton, UpdateParametersButton};
