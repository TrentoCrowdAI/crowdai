/**
 * Bussiness logic related to Shortest Run strategy.
 */
const Boom = require('boom');
const request = require('request');

const managers = require(__base + 'managers');
const delegates = require(__base + 'delegates');
const db = require(__base + 'db');

// This should match with the corresponding record in the task_assignment_api table.
exports.NAME = 'Shortest Run';

const ShortestRunStates = (exports.ShortestRunStates = Object.freeze({
  INITIAL: 'INITIAL',
  BASELINE_GENERATED: 'BASELINE_GENERATED',
  ASSIGN_FILTERS: 'ASSIGN_FILTERS',
  FILTERS_ASSIGNED: 'FILTERS_ASSIGNED',
  UPDATED: 'UPDATED',
  DONE: 'DONE'
}));

const OUT_THRESHOLD = 0.99;
const IN_THRESHOLD = 0.99;
const STOP_SCORE = 30;

/**
 * Calls the POST /generate-baseround endpoint to generate the entries for
 * the baseline round.
 *
 * @param {Number} jobId
 * @param {Number} size
 */
const generateBaseline = (exports.generateBaseline = async (jobId, size) => {
  if (!jobId) {
    throw Boom.badRequest('The job ID is required');
  }
  let job = await delegates.jobs.getById(jobId);
  let taskAssignmentApi = await delegates.taskAssignmentApi.getById(
    job.data.taskAssignmentStrategy
  );
  const url = `${managers.task.getUrl(taskAssignmentApi)}/generate-baseround`;
  const payload = {
    jobId,
    size
  };
  let response = await new Promise((resolve, reject) => {
    request(
      {
        url,
        method: 'POST',
        json: {
          ...payload
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

  if (response && typeof response === 'string') {
    response = JSON.parse(response);
  }
  job.data.shortestRun.state = ShortestRunStates.BASELINE_GENERATED;
  await delegates.jobs.update(job.id, job);
  return response;
});

/**
 * Calls the /generate-tasks endpoint of Shortest Run task assignment box.
 *
 * @param {Number} jobId
 * @return {Object} The job updated.
 */
const assignFilters = (exports.assignFilters = async jobId => {
  if (!jobId) {
    throw Boom.badRequest('The job ID is required');
  }
  let job = await delegates.jobs.getById(jobId);
  let taskAssignmentApi = await delegates.taskAssignmentApi.getById(
    job.data.taskAssignmentStrategy
  );
  const url = `${managers.task.getUrl(taskAssignmentApi)}/generate-tasks`;
  const payload = {
    jobId: job.id,
    criteria: getCriteriaPayload(job.data.shortestRun.parametersEstimation),
    stopScore: STOP_SCORE,
    outThreshold: OUT_THRESHOLD
  };

  let response = await new Promise((resolve, reject) => {
    request(
      {
        url,
        method: 'POST',
        json: {
          ...payload
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

  if (response && typeof response === 'string') {
    response = JSON.parse(response);
  }
  job.data.shortestRun.state = ShortestRunStates.FILTERS_ASSIGNED;
  return await delegates.jobs.update(job.id, job);
});

/**
 * Runs the following steps of Shortest Run algorithm: parameters update, and classification.
 * Calls the following services:
 *   PUT /update-filter-params
 *   POST /classify
 *
 *
 * @param {Object} job
 * @return
 * @throws Will throw an error upon failure.
 */
const updateAndClassify = (exports.updateAndClassify = async job => {
  if (!job) {
    throw Boom.badRequest('The job is required');
  }
  let taskAssignmentApi = await delegates.taskAssignmentApi.getById(
    job.data.taskAssignmentStrategy
  );
  let baseUrl = managers.task.getUrl(taskAssignmentApi);
  let payload = {
    criteria: getCriteriaPayload(job.data.shortestRun.parametersEstimation)
  };

  let response = await new Promise((resolve, reject) => {
    request(
      {
        url: `${baseUrl}/update-filter-params/${job.id}`,
        method: 'PUT',
        json: {
          ...payload
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

  if (response && typeof response === 'string') {
    response = JSON.parse(response);
  }
  // we update the estimations
  for (let param of job.data.shortestRun.parametersEstimation) {
    param.accuracy = response.criteria[param.criteria].accuracy;
    param.selectivity = response.criteria[param.criteria].selectivity;
  }
  // classification step
  payload = {
    jobId: job.id,
    criteria: response.criteria,
    outThreshold: OUT_THRESHOLD,
    inThreshold: IN_THRESHOLD
  };

  response = await new Promise((resolve, reject) => {
    request(
      {
        url: `${baseUrl}/classify`,
        method: 'POST',
        json: {
          ...payload
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
  job.data.shortestRun.state = ShortestRunStates.UPDATED;
  return await delegates.jobs.update(job.id, job);
});

/**
 * Calls POST /estimate-task-parameters to estimate the parameter when baseline round finishes.
 *
 * @param {Object} job
 * @return {Object} The updated job
 */
const estimateParameters = (exports.estimateParameters = async job => {
  if (!job) {
    throw Boom.badRequest('The job is required');
  }
  let taskAssignmentApi = await delegates.taskAssignmentApi.getById(
    job.data.taskAssignmentStrategy
  );
  let baseUrl = managers.task.getUrl(taskAssignmentApi);
  let payload = {
    jobId: job.id,
    outThreshold: OUT_THRESHOLD
  };
  let response = await new Promise((resolve, reject) => {
    request(
      {
        url: `${baseUrl}/estimate-task-parameters`,
        method: 'POST',
        json: {
          ...payload
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

  if (response && typeof response === 'string') {
    response = JSON.parse(response);
  }
  // we map the response from the API before storing it on the DB.
  let estimations = [];

  for (let [id, value] of Object.entries(response.criteria)) {
    let entry = {
      criteria: id,
      accuracy: value.accuracy,
      selectivity: value.selectivity
    };

    entry.workers = response.workersAccuracy[id].map(w => {
      let [workerId, accuracy] = Object.entries(w)[0];
      return { id: workerId, accuracy };
    });
    estimations.push(entry);
  }
  job.data.shortestRun.parametersEstimation = estimations;
  let updated = await delegates.jobs.update(job.id, job);
  return updated;
});

/**
 * This method estimates the cost of publishing the given job to AMT. The cost estimated
 * is for the best-case scenario.
 *
 * @param {Object} job
 * @return {Number}
 */
const getEstimatedCost = (exports.getEstimatedCost = async job => {
  const { shortestRun } = job.data;
  let numTasksPerWorkerDefault = managers.task.getEstimatedTasksPerWorkerCount(
    job
  );
  if (
    shortestRun.state === ShortestRunStates.BASELINE_GENERATED ||
    shortestRun.state === ShortestRunStates.FILTERS_ASSIGNED
  ) {
    let cost = 0;
    let rsp = await db.query(
      `select count(item_id) as count, criterion_id as filter from backlog b
        where b.step = (
          select max(step) from backlog where job_id = $1
        ) 
        and b.job_id = $1
        group by criterion_id
     `,
      [job.id]
    );

    for (let entry of rsp.rows) {
      let count = Number(entry.count);

      if (shortestRun.state === ShortestRunStates.BASELINE_GENERATED) {
        count *= job.data.votesPerTaskRule;
      }

      if (count <= job.data.maxTasksRule) {
        // only one worker here.
        let numTasksForWorker = managers.task.getEstimatedTasksPerWorkerCount(
          job,
          count
        );
        cost += numTasksForWorker * job.data.taskRewardRule;
      } else if (count % job.data.maxTasksRule === 0) {
        // every worker gets the same amount of tasks.
        let numWorkers = count / job.data.maxTasksRule;
        cost += numWorkers * numTasksPerWorkerDefault * job.data.taskRewardRule;
      } else {
        // one (final) worker does not receive the same amount of tasks.
        let numWorkers = Math.floor(count / job.data.maxTasksRule);
        cost += numWorkers * numTasksPerWorkerDefault * job.data.taskRewardRule;
        let numTasksForLastWorker = managers.task.getEstimatedTasksPerWorkerCount(
          job,
          count - numWorkers * job.data.maxTasksRule
        );
        cost += numTasksForLastWorker * job.data.taskRewardRule;
      }
    }
    return cost;
  }
  return 0;
});

/**
 * Checks if the job is done. The job is done if every item is in the
 * result table.
 *
 * @param {Object} job
 * @return {Boolean}
 */
const isDone = (exports.isDone = async job => {
  let itemsCount = await delegates.projects.getItemsCount(job.project_id);
  let classifiedCount = await delegates.jobs.getClassifiedItemsCount(job.id);
  return itemsCount === classifiedCount;
});

const getCriteriaPayload = parameters => {
  let criteria = {};

  for (let param of parameters) {
    criteria[param.criteria] = {
      accuracy: param.accuracy,
      selectivity: param.selectivity
    };
  }
  return criteria;
};
