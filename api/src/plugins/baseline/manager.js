/**
 * Bussiness logic related to Baseline strategy.
 */
const managers = require(__base + 'managers');
const delegates = require(__base + 'delegates');

// This should match with the corresponding record in the task_assignment_api table.
exports.NAME = 'Baseline';

/**
 * This method estimates the cost of publishing the given job to AMT. The cost estimated
 * is for the best-case scenario.
 *
 * @param {Object} job
 * @return {Object} The estimated cost. Zero means estimation is not yet possible. Format
 *                  {total: <number>, totalWorkers: <number>, details: [{criteria: <number>, numWorkers: <number>, totalTasksPerWorker: <number>, cost: <number>}]}
 */
const getEstimatedCost = (exports.getEstimatedCost = async job => {
  const itemsCount = await delegates.projects.getItemsCount(job.project_id);
  const filters = await delegates.projects.getCriteria(job.project_id);
  const filtersCount = filters.meta.count;

  if (itemsCount <= job.data.maxTasksRule) {
    let numTasksForWorker = managers.task.getEstimatedTasksPerWorkerCount(
      job,
      itemsCount
    );
    let total =
      numTasksForWorker *
      job.data.votesPerTaskRule *
      filtersCount *
      job.data.taskRewardRule;
    let details = [];

    for (let i = 0; i < filtersCount; i++) {
      details.push({
        criteria: filters.rows[i].id,
        numWorkers: job.data.votesPerTaskRule,
        totalTasksPerWorker: numTasksForWorker,
        cost:
          numTasksForWorker *
          job.data.votesPerTaskRule *
          job.data.taskRewardRule
      });
    }

    return {
      total,
      totalWorkers: details.reduce((s, d) => s + d.numWorkers, 0),
      details
    };
  } else if (itemsCount % job.data.maxTasksRule === 0) {
    let numWorkers = itemsCount / job.data.maxTasksRule;
    let numTasksForWorker = managers.task.getEstimatedTasksPerWorkerCount(job);
    let total =
      numWorkers *
      numTasksForWorker *
      job.data.votesPerTaskRule *
      filtersCount *
      job.data.taskRewardRule;

    let details = [];

    for (let i = 0; i < filtersCount; i++) {
      details.push({
        criteria: filters.rows[i].id,
        numWorkers: numWorkers * job.data.votesPerTaskRule,
        totalTasksPerWorker: numTasksForWorker,
        cost:
          numWorkers *
          numTasksForWorker *
          job.data.votesPerTaskRule *
          job.data.taskRewardRule
      });
    }
    return {
      total,
      totalWorkers: details.reduce((s, d) => s + d.numWorkers, 0),
      details
    };
  } else {
    let numWorkers = Math.floor(itemsCount / job.data.maxTasksRule);
    let numTasksPerWorker = managers.task.getEstimatedTasksPerWorkerCount(job);
    let numTasksForLastWorker = managers.task.getEstimatedTasksPerWorkerCount(
      job,
      itemsCount - numWorkers * job.data.maxTasksRule
    );
    /**
     * let cost =
     *   numWorkers *
     *   numTasksPerWorker *
     *   job.data.votesPerTaskRule *
     *   filtersCount *
     *   job.data.taskRewardRule;
     *
     * cost +=
     *  numTasksForLastWorker *
     *  job.data.votesPerTaskRule *
     *   filtersCount *
     *   job.data.taskRewardRule;
     */

    // just a factorized version of what the one (commented) above.
    let k = job.data.votesPerTaskRule * filtersCount * job.data.taskRewardRule;
    let total = k * (numWorkers * numTasksPerWorker + numTasksForLastWorker);

    let details = [];

    for (let i = 0; i < filtersCount; i++) {
      details.push(
        {
          criteria: filters.rows[i].id,
          numWorkers: numWorkers * job.data.votesPerTaskRule,
          totalTasksPerWorker: numTasksPerWorker,
          cost:
            numWorkers *
            numTasksPerWorker *
            job.data.votesPerTaskRule *
            job.data.taskRewardRule
        },
        {
          criteria: filters.rows[i].id,
          numWorkers: job.data.votesPerTaskRule,
          totalTasksPerWorker: numTasksForLastWorker,
          cost:
            numTasksForLastWorker *
            job.data.votesPerTaskRule *
            job.data.taskRewardRule
        }
      );
    }
    return {
      total,
      totalWorkers: details.reduce((s, d) => s + d.numWorkers, 0),
      details
    };
  }
});

// This implementation just returns the payload
exports.processEstimationsPayload = (job, payload) => {
  return payload;
};
