import React from 'react';
import PropTypes from 'prop-types';

import JobFormShortestRunPlugin from 'src/components/admin/plugins/shortest-run/JobFormShortestRunPlugin';
import {RegisteredTaskAssignmentStrategies} from 'src/utils/constants';

/**
 * This components allows the task assignment strategies to set additional
 * fields to the JobForm.
 */
class JobFormPlugin extends React.Component {
  render() {
    const {job} = this.props;
    let strategy = job.taskAssignmentStrategy;

    if (!job.id) {
      strategy = this.props.strategies.filter(s => Number(s.id) === job.data.taskAssignmentStrategy)[0];
    }

    if (strategy.name === RegisteredTaskAssignmentStrategies.SHORTEST_RUN) {
      return <JobFormShortestRunPlugin />;
    }
    return null;
  }
}

JobFormPlugin.propTypes = {
  job: PropTypes.object,
  strategies: PropTypes.arrayOf(PropTypes.object)
};

export default JobFormPlugin;
