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
  // TODO: remove this fixed payload when the EM step is implemented.
  const payload = {
    jobId: job.id,
    criteria: {
      41: { accuracy: 0.85, selectivity: 0.28 },
      42: { accuracy: 0.9, selectivity: 0.28 },
      43: { accuracy: 0.86, selectivity: 0.42 }
    },
    stopScore: 30,
    outThreshold: 0.99
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
  // TODO: update state to FILTERS_ASSIGNED
  return response;
});

/**
 * Runs the following steps of Shortest Run algorithm: parameters update, and classification.
 * Calls the following services:
 *   PUT /update-filter-params
 *   POST /classify
 *
 *
 * @param {Number} jobId
 * @return
 * @throws Will throw an error upon failure.
 */
const updateAndClassify = (exports.updateAndClassify = async jobId => {
  if (!jobId) {
    throw Boom.badRequest('The job ID is required');
  }
  let job = await delegates.jobs.getById(jobId);
  let taskAssignmentApi = await delegates.taskAssignmentApi.getById(
    job.data.taskAssignmentStrategy
  );
  let baseUrl = managers.task.getUrl(taskAssignmentApi);
  // updating step
  // TODO: remove fixed paylaod
  let payload = {
    criteria: {
      '41': { accuracy: 0.85, selectivity: 0.28 },
      '42': { accuracy: 0.9, selectivity: 0.28 },
      '43': { accuracy: 0.86, selectivity: 0.42 }
    }
  };

  let updatedParams = await new Promise((resolve, reject) => {
    request(
      {
        url: `${baseUrl}/update-filter-params/${jobId}`,
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
  // TODO: store this response somewhere. Probably as an attribute of the job.
  if (updatedParams && typeof updatedParams === 'string') {
    updatedParams = JSON.parse(updatedParams);
  }

  // classification step

  // TODO: we should retrieve the payload from db (probably as a property of the job)
  //       inThreshold and outThreshold are parameter (we can add these in the frontend probably)
  payload = {
    jobId: 19,
    criteria: {
      '41': { accuracy: 0.85, selectivity: 0.28 },
      '42': { accuracy: 0.86, selectivity: 0.42 },
      '43': { accuracy: 0.9, selectivity: 0.28 }
    },
    outThreshold: 0.99,
    inThreshold: 0.99
  };

  let response = await new Promise((resolve, reject) => {
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

  // TODO: update state to UPDATED / DONE.
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
      if (entry.count <= job.data.maxTasksRule) {
        // only one worker here.
        let numTasksForWorker = managers.task.getEstimatedTasksPerWorkerCount(
          job,
          entry.count
        );

        if (shortestRun.state === ShortestRunStates.BASELINE_GENERATED) {
          numTasksForWorker *= job.data.votesPerTaskRule;
        }
        cost += numTasksForWorker * job.data.taskRewardRule;
      } else if (entry.count % job.data.maxTasksRule === 0) {
        // every worker gets the same amount of tasks.
        let numWorkers = entry.count / job.data.maxTasksRule;

        if (shortestRun.state === ShortestRunStates.BASELINE_GENERATED) {
          numWorkers *= job.data.votesPerTaskRule;
        }
        cost += numWorkers * numTasksPerWorkerDefault * job.data.taskRewardRule;
      } else {
        // one (final) worker does not receive the same amount of tasks.
        let numWorkers = Math.floor(entry.count / job.data.maxTasksRule);
        let aux = numWorkers;

        if (shortestRun.state === ShortestRunStates.BASELINE_GENERATED) {
          aux *= job.data.votesPerTaskRule;
        }
        cost += aux * numTasksPerWorkerDefault * job.data.taskRewardRule;
        let numTasksForLastWorker = managers.task.getEstimatedTasksPerWorkerCount(
          job,
          entry.count - numWorkers * job.data.maxTasksRule
        );

        if (shortestRun.state === ShortestRunStates.BASELINE_GENERATED) {
          numTasksForLastWorker *= job.data.votesPerTaskRule;
        }
        cost += numTasksForLastWorker * job.data.taskRewardRule;
      }
    }
    return cost;
  }
  return 0;
});
