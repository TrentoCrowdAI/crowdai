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
 */
const getEstimatedCost = (exports.getEstimatedCost = async job => {
  const itemsCount = await delegates.projects.getItemsCount(job.project_id);
  const filtersCount = await delegates.projects.getCriteriaCount(
    job.project_id
  );

  if (itemsCount <= job.data.maxTasksRule) {
    let numTasksForWorker = managers.task.getEstimatedTasksPerWorkerCount(
      job,
      itemsCount
    );
    return (
      numTasksForWorker *
      job.data.votesPerTaskRule *
      filtersCount *
      job.data.taskRewardRule
    );
  } else if (itemsCount % job.data.maxTasksRule === 0) {
    let numWorkers = itemsCount / job.data.maxTasksRule;
    let numTasksForWorker = managers.task.getEstimatedTasksPerWorkerCount(job);
    return (
      numWorkers *
      numTasksForWorker *
      job.data.votesPerTaskRule *
      filtersCount *
      job.data.taskRewardRule
    );
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
    return k * (numWorkers * numTasksPerWorker + numTasksForLastWorker);
  }
});
