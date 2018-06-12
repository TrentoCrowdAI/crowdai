/**
 * Shortest Run plugin listen for some of the event that the platform
 * emits to add its custom logic.
 */
const { on } = require(__base + 'events/emitter');
const manager = require('./manager');
const { ShortestRunStates } = manager;
const delegates = require(__base + 'delegates');
const { EventTypes } = require(__base + 'events/types');
const { JobStatus } = require(__base + 'utils/constants');
const db = require(__base + 'db');

/**
 * We listen to the JOB_CREATED event to add the
 * basic shortestRun property to the job json data column.
 */
exports.onJobCreated = async job => {
  try {
    if (!job) {
      console.warn('The JOB_CREATED handler should receive a job as parameter');
      return;
    }
    let taskAssignmentApi = await delegates.taskAssignmentApi.getById(
      job.data.taskAssignmentStrategy
    );

    if (taskAssignmentApi.name !== 'Shortest Run') {
      return;
    }
    job.data.shortestRun.state = ShortestRunStates.INITIAL;
    await delegates.jobs.update(job.id, job);
  } catch (error) {
    console.error(error);
  }
};

/**
 * This handler allows Shortest Run to manipulate the status of the Job
 * so that we can publish multiple HITs for each of the steps of Shortest Run. It
 * also automatically runs:
 *
 * 1) manager.estimateParameters when baseline round finishes.
 * 2) manager.updateAndClassify when a follow-up iteration of Shortest Run finishes.
 *
 *
 * @param {Object} job
 * @return {Object} The job updated
 */
exports.onJobReviewDone = async job => {
  try {
    let isDone = await manager.isDone(job);
    if (isDone) {
      job.data.shortestRun.state = ShortestRunStates.DONE;
    } else {
      if (job.data.shortestRun.state === ShortestRunStates.BASELINE_GENERATED) {
        job = await manager.estimateParameters(job);
      } else if (
        job.data.shortestRun.state === ShortestRunStates.FILTERS_ASSIGNED
      ) {
        job = await manager.updateAndClassify(job);
      }

      job.data.status = JobStatus.NOT_PUBLISHED;
      job.data.end = undefined;

      if (!job.data.shortestRun.hits) {
        job.data.shortestRun.hits = [];
      }
      let rsp = await db.query(
        'select max(step) as step from backlog where job_id = $1',
        [job.id]
      );
      let currentStep = rsp.rows[0].step;
      job.data.shortestRun.hits.push({
        step: currentStep,
        hit: job.data.hit
      });
      job.data.hit = undefined;
    }
    return await delegates.jobs.update(job.id, job);
  } catch (error) {
    console.log(error);
  }
};

// we register the handlers
on(EventTypes.job.JOB_CREATED, job => exports.onJobCreated(job));
on(EventTypes.job.JOB_REVIEW_DONE, job => exports.onJobReviewDone(job));
