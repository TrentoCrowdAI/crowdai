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
    let response = await getTasksFromApi(job, worker);

    if (response.items && response.items.length > 0) {
      buffer = await delegates.tasks.createBuffer(job.id, worker.id, response);
    }

    if (response.done) {
      await jobManager.stop(job);
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

    let response = await new Promise((resolve, reject) => {
      request(
        {
          url: taskAssignmentApi.url,
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
