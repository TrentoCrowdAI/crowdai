const request = require('request');

const delegates = require(__base + 'delegates');

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
    // call the task assignment API.
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

    if (response.items && response.items.length > 0) {
      buffer = await delegates.tasks.createBuffer(job.id, worker.id, response);
    }

    if (response.done) {
      // TODO: finish the job
    }
  }
  return buffer;
});
