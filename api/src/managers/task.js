const request = require('request');
const Boom = require('boom');

const delegates = require(__base + 'delegates');
const db = require(__base + 'db');

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

/**
 * This method returns a summary of the missing votes per each (item, filter) pair.
 *
 * @param {Object} job
 * @return {Object} A summary of the number of votes pendings. It has the following format:
 *
 * @example
 *
 * [
 *    {item: 1, filter: 1, pending: 1},
 *    {item: 2, filter: 1, pending: 2},
 *    {item: 3, filter: 2, pending: 2}
 * ]
 */
exports.getPendingVotes = async job => {
  let rsp = await db.query(
    `select t.item_id as item, (t.data->'criteria')::json#>>'{0,id}' as filter, count(t.item_id) as pending
      from ${db.TABLES.Task} t
      where t.job_id = $1 
        and t.deleted_at is not null
      group by (t.data->'criteria')::json#>>'{0,id}', t.item_id`,
    [job.id]
  );
  return rsp.rows;
};

/**
 * This methods estimated the number of workers needed to complete the missing votes.
 *
 * @param {Object} job
 * @param {Object[]} pendings A summary of the missing votes, as returned by {@link coordinator#getPendingVotes}
 * @return {Number}
 */
exports.getEstimatedWorkersCount = async (job, pendings) => {
  const filters = new Set(pendings.map(p => p.filter));
  let totalCount = 0;

  for (let filter of filters) {
    let fpendings = getPendingsForFilter(filter, pendings);

    while (fpendings.length > 0) {
      let vc = 0; // votes for current worker
      ++totalCount;

      for (let p of fpendings) {
        --p.pending;
        ++vc;

        if (vc === job.data.maxTasksRule) {
          break;
        }
      }
      fpendings = getPendingsForFilter(filter, pendings);
    }
  }
  return totalCount;
};

const getPendingsForFilter = (filter, pendings) =>
  pendings.filter(p => p.filter === filter && p.pending > 0);
