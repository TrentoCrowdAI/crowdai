/**
 * The plugin coordinator simply deals with routing any business logic method,
 * related to a crowdsourcing strategy, to the right implementation.
 */
const Boom = require('boom');

const baselineManager = require('./baseline/manager');
const shortestRunManager = require('./shortest-run/manager');
const taskAssignmentApiDelegate = require(__base +
  'delegates/task-assignment-api');

let managersMap = {
  [baselineManager.NAME]: baselineManager,
  [shortestRunManager.NAME]: shortestRunManager
};

/**
 * This method estimates the cost of publishing the given job to AMT. The cost estimated
 * is for the best-case scenario.
 *
 * @param {Object} job
 * @return {Object} The estimated cost. Zero means estimation is not yet possible. Format
 *                  {total: <number>, details: [{criteria: <number>, numWorkers: <number>, totalTasksPerWorker: <number>, cost: <number>}]}
 */
exports.getEstimatedCost = async job => {
  if (!job) {
    throw Boom.badRequest('The job is required');
  }

  let taskAssignmentApi = await taskAssignmentApiDelegate.getById(
    job.data.taskAssignmentStrategy
  );

  if (!taskAssignmentApi) {
    throw Boom.badRequest('The job does not have a task assignment strategy');
  }
  const mngr = managersMap[taskAssignmentApi.name];

  if (!mngr) {
    throw Boom.badRequest(
      'The manager for the task assignment strategy does not exist'
    );
  }
  let cost = await mngr.getEstimatedCost(job);
  return cost;
};
