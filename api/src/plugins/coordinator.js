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
 * @return {Object} The estimated cost. Zero means estimation is not yet possible.
 * @example
 *
 * Output format:
 * {
 *  total: <number>,
 *  totalWorkers: <number>,
 *  details: [
 *    {criteria: <number>, numWorkers: <number>, totalTasksPerWorker: <number>, cost: <number>}
 *  ]
 * }
 */
exports.getEstimatedCost = async job => {
  let mngr = await getManager(job);
  let cost = await mngr.getEstimatedCost(job);
  return cost;
};

/**
 * This method is a hook for modifying the payload before calling the POST /estimates endpoint
 * of the estimations-api.
 *
 * @param {Object} job
 * @param {Object} payload
 * @return {Object} A modified version of the payload
 */
exports.processEstimationsPayload = async (job, payload) => {
  let mngr = await getManager(job);
  return mngr.processEstimationsPayload(job, payload);
};

/**
 * Just a private helper to return the manager for the given job.
 *
 * @param {Object} job
 * @private
 */
const getManager = async job => {
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
  return mngr;
};
