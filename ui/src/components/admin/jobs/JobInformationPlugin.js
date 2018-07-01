import React from 'react';
import PropTypes from 'prop-types';

import {RegisteredTaskAssignmentStrategies} from 'src/utils/constants';
import JobInformationShortestRun from 'src/components/admin/plugins/shortest-run/JobInformationShortestRun';

/**
 * This components allows the task assignment strategies to set additional
 * fields to the job information section of the JobDashboard.
 *
 * @return {JSX.Element}
 */
const JobInformationPlugin = ({job}) => {
  let strategy = job.taskAssignmentStrategy;

  if (strategy && strategy.name === RegisteredTaskAssignmentStrategies.SHORTEST_RUN) {
    return <JobInformationShortestRun job={job} />;
  }
  return null;
};

const JobInformationPluginPropTypes = {
  job: PropTypes.object
};

JobInformationPlugin.propTypes = JobInformationPluginPropTypes;

export {JobInformationPluginPropTypes};

export default JobInformationPlugin;
