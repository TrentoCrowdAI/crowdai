/**
 * Shortest Run plugin listen for some of the event that the platform
 * emits to add its custom logic.
 */
const { on } = require(__base + 'events/emitter');
const { ShortestRunStates } = require('./manager');
const delegates = require(__base + 'delegates');
const { EventTypes } = require(__base + 'events/types');

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

    let shortestRun = {
      state: ShortestRunStates.INITIAL
    };

    job.data.shortestRun = shortestRun;
    await delegates.jobs.update(job.id, job);
  } catch (error) {
    console.error(error);
  }
};

// we register the handler
on(EventTypes.job.JOB_CREATED, job => exports.onJobCreated(job));
