const request = require('request');
const Boom = require('boom');

const delegates = require(__base + 'delegates');
const jobManager = require('./job');

/**
 * Generate the tasks for the given worker. It integrates with the
 * task assignment API associated with the job.
 *
 * @param {Object} job
 * @param {Object} worker
 * @returns {Object} -- {items: [], criteria: []}
 */
const generateTasks = (exports.generateTasks = async (job, worker) => {
  let buffer = await delegates.tasks.getBuffer(job.id, worker.id);

  if (!buffer) {
    // by default we say we are done with the worker
    buffer = { items: [], criteria: [] };
    let response = await getTasksFromApi(job, worker);

    if (response.items && response.items.length > 0) {
      buffer = await delegates.tasks.createBuffer(job.id, worker.id, response);
    }
  }
  return buffer;
});

/**
 * Calls the task assignment API to retrieve the tasks we must assign to the worker.
 *
 * @param {Object} job
 */
const getTasksFromApi = (exports.getTasksFromApi = async (job, worker) => {
  try {
    let taskAssignmentApi = await delegates.taskAssignmentApi.getById(
      job.data.taskAssignmentStrategy
    );
    const url = `${getUrl(taskAssignmentApi)}/next-task`;

    let response = await new Promise((resolve, reject) => {
      request(
        {
          url,
          qs: {
            jobId: job.id,
            workerId: worker.id,
            maxItems: job.data.maxTasksRule
          }
        },
        (err, rsp, body) => {
          if (err) {
            reject(err);
          } else {
            resolve(rsp.body);
          }
        }
      );
    });

    if (typeof response === 'string') {
      response = JSON.parse(response);
    }
    return response;
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation(
      'Error while trying to call generate tasks for worker'
    );
  }
});

/**
 * This function calls the tasks assignment /status endpoint. This endpoint is not
 * required, therefore, if is not present we will just return null as the state.
 *
 * @param {Object} job
 * @return {String}
 */
const getState = (exports.getState = async job => {
  try {
    let taskAssignmentApi = await delegates.taskAssignmentApi.getById(
      job.data.taskAssignmentStrategy
    );
    const url = `${getUrl(taskAssignmentApi)}/state`;

    let response = await new Promise((resolve, reject) => {
      request(
        {
          url,
          qs: {
            jobId: job.id
          }
        },
        (err, rsp, body) => {
          if (err) {
            if (err.code === 'ECONNREFUSED') {
              resolve(null);
            }
            reject(err);
          } else if (rsp.statusCode === 400) {
            reject(rsp.statusMessage);
          } else if (rsp.statusCode === 404) {
            resolve(null);
          } else {
            resolve(rsp.body);
          }
        }
      );
    });

    if (response && typeof response === 'string') {
      response = JSON.parse(response);
      return response.state;
    }
    return null;
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation(
      'Error while trying to call the state endpoint'
    );
  }
});

/**
 * Returns the URL of the task assignment API.
 *
 * @param {Object} taskAssignmentApi
 * @return {String}
 */
const getUrl = (exports.getUrl = taskAssignmentApi => {
  let url = taskAssignmentApi.url;

  if (url.endsWith('/')) {
    url = url.substr(0, url.length - 1);
  }
  return url;
});

/**
 * Returns the estimated number of tasks per worker for the given job.
 *
 * @param {Object} job
 * @param {Number} actualNumTasks In case we now the actual number of tasks for the worker
 * @return {Number}
 */
const getEstimatedTasksPerWorkerCount = (exports.getEstimatedTasksPerWorkerCount = (
  job,
  actualNumTasks
) => {
  if (!job) {
    throw Boom.badRequest('The job is required');
  }
  let numTasks = actualNumTasks || job.data.maxTasksRule;
  let estimated = job.data.initialTestsRule + numTasks;

  if (numTasks > job.data.testFrequencyRule) {
    estimated += Math.floor(numTasks / job.data.testFrequencyRule);

    if (job.data.testFrequencyRule === 1) {
      estimated -= 1;
    }
  }
  return estimated;
});
