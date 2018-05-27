import React from 'react';
import PropTypes from 'prop-types';
import {Grid, Button} from 'semantic-ui-react';
import {connect} from 'react-redux';

import {JobStatus, ShortestRunStatus} from 'src/utils/constants';
import {actions} from './actions';
import {actions as srActions} from './shortest-run-actions';

class JobDashboardButtons extends React.Component {
  constructor(props) {
    super(props);
    // TODO: remove this after implementing #89
    this.state = {
      expertMode: true
    };
  }
  render() {
    const {state} = this.props;

    return (
      <Grid.Row>
        <Grid.Column>
          <RunButton {...this.props} />

          {state.job === JobStatus.PUBLISHED && (
            <Button floated="right" size="large" negative>
              Stop
            </Button>
          )}

          {this.state.expertMode && (
            <Button floated="right" size="large" style={{width: '200px'}}>
              Update parameters
            </Button>
          )}
        </Grid.Column>
      </Grid.Row>
    );
  }
}

const RunButton = ({job, state, publish, assignFilters}) => {
  if (canPublish(state)) {
    return (
      <Button onClick={() => publish()} floated="right" size="large" positive>
        Run: publish on AMT
      </Button>
    );
  }

  if (state.taskAssignmentApi === ShortestRunStatus.ASSIGN_FILTERS) {
    return (
      <Button onClick={() => assignFilters(job.id)} floated="right" size="large" positive>
        Run: assign filters
      </Button>
    );
  }

  if (state.taskAssignmentApi === ShortestRunStatus.INITIAL) {
    return (
      <Button onClick={() => publish()} floated="right" size="large" positive>
        Run: generate tasks for baseline
      </Button>
    );
  }
  return null;
};

RunButton.propTypes = {
  state: PropTypes.object,
  job: PropTypes.object,
  publish: PropTypes.func,
  assignFilters: PropTypes.func
};

/**
 * This method checks if we can publish to AMT. In the case task assignment box implements
 * the state service, then we will need to add here additional conditions to manage the
 * states defined by the task assignment API.
 *
 * @param {Object} state
 * @return {Boolean}
 */
const canPublish = state => {
  if (!state.taskAssignmentApi) {
    return state.job === JobStatus.NOT_PUBLISHED;
  }
  // for shortest run
  return state.job === JobStatus.NOT_PUBLISHED && state.taskAssignmentApi === ShortestRunStatus.FILTERS_ASSIGNED;
};

JobDashboardButtons.propTypes = {
  state: PropTypes.object,
  job: PropTypes.object
};

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  publish: () => dispatch(actions.publish()),
  assignFilters: jobId => dispatch(srActions.assignFilters(jobId))
});

export default connect(mapStateToProps, mapDispatchToProps)(JobDashboardButtons);
