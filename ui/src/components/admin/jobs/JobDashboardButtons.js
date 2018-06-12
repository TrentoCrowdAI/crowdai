import React from 'react';
import PropTypes from 'prop-types';
import {Grid, Button, Label, Popup} from 'semantic-ui-react';
import {connect} from 'react-redux';

import {JobStatus, RegisteredTaskAssignmentStrategies} from 'src/utils/constants';
import {actions} from './actions';
import JobDashboardButtonsShortestRun from 'src/components/admin/shortest-run/JobDashboardButtonsShortestRun';
import EstimatedCostDetails from './EstimatedCostDetails';

class JobDashboardButtons extends React.Component {
  constructor(props) {
    super(props);
    // TODO: remove this after implementing #89
    this.state = {
      expertMode: true
    };
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
            <JobDashboardButtonsShortestRun {...this.props} expertMode={this.state.expertMode} />
          )}
          {taskAssignmentStrategy.name === RegisteredTaskAssignmentStrategies.BASELINE && (
            <SimpleTaskAssignmentStrategyButtons {...this.props} expertMode={this.state.expertMode} />
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

const StopButton = ({jobState}) => {
  if (jobState.job === JobStatus.PUBLISHED) {
    return (
      <Button floated="right" size="large" negative>
        Stop
      </Button>
    );
  }
  return null;
};
StopButton.propTypes = {
  jobState: PropTypes.object
};

const UpdateParametersButton = ({expertMode, jobState}) => {
  if (expertMode && jobState.job !== JobStatus.DONE) {
    return (
      <Button floated="right" size="large" style={{width: '200px'}}>
        Update parameters
      </Button>
    );
  }
  return null;
};
UpdateParametersButton.propTypes = {
  jobState: PropTypes.object,
  // TODO: remove this after implementing #89
  expertMode: PropTypes.bool
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

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  publish: () => dispatch(actions.publish())
});

export default connect(mapStateToProps, mapDispatchToProps)(JobDashboardButtons);

export {PublishButton, StopButton, UpdateParametersButton};
