import React from 'react';
import PropTypes from 'prop-types';

import JobFormShortestRunPlugin, {
  cleanProps
} from 'src/components/admin/plugins/shortest-run/JobFormShortestRunPlugin';
import {RegisteredTaskAssignmentStrategies} from 'src/utils/constants';

/**
 * This components allows the task assignment strategies to set additional
 * fields to the JobForm. Each plugin should implement a method called cleanProps
 * that JobFormPlugin calls to clean additional properties added by the strategy.
 */
class JobFormPlugin extends React.Component {
  render() {
    const {job} = this.props;
    let strategy = job.taskAssignmentStrategy;

    if (!job.id) {
      strategy = this.getStrategy(job);
    }

    if (strategy.name === RegisteredTaskAssignmentStrategies.SHORTEST_RUN) {
      return <JobFormShortestRunPlugin job={job} strategies={this.props.strategies} />;
    }
    return null;
  }

  componentDidUpdate(prevProps) {
    const prevStrategy = this.getStrategy(prevProps.job);
    let cleanMethod = cleanPropsMap[prevStrategy.name];

    if (this.props.job.data.taskAssignmentStrategy !== prevProps.job.data.taskAssignmentStrategy && cleanMethod) {
      cleanMethod();
    }
  }

  getStrategy(job) {
    return this.props.strategies.filter(s => Number(s.id) === job.data.taskAssignmentStrategy)[0];
  }
}

const cleanPropsMap = {
  [RegisteredTaskAssignmentStrategies.SHORTEST_RUN]: cleanProps
};

JobFormPlugin.propTypes = {
  job: PropTypes.object,
  strategies: PropTypes.arrayOf(PropTypes.object)
};

export default JobFormPlugin;
