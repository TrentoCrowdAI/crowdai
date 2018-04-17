const delegates = require(__base + 'delegates');
const qualityManager = require('./quality');

/**
 * Verify the status of the worker's assignment.
 *
 * @param {Object} job - The experiment
 * @param {Object} worker - The worker
 * @param {String} assignmentTurkId - The worker's assignment ID on Mechanical Turk.
 */
const getWorkerAssignmentStatus = (exports.getWorkerAssignmentStatus = async (
  job,
  worker,
  assignmentTurkId
) => {
  let assignment = await delegates.workers.getAssignment(job.uuid, worker.id);

  if (!assignment) {
    assignment = await delegates.workers.createAssignment({
      job_id: job.id,
      job_uuid: job.uuid,
      worker_id: worker.id,
      data: {
        assignmentTurkId
      }
    });
    return assignment;
  }

  const answersCount = await delegates.tasks.getWorkerTasksCount(
    job.id,
    worker.id
  );

  if (answersCount >= job.data.maxTasksRule) {
    return await finishAssignment(job.uuid, worker.id, {
      finishedByMaxTasksRule: true
    });
  }
  return await qualityManager.checkWorkerAssignment(job, worker, assignment);
});

/**
 * A worker choses to finish their assignment.
 *
 * @param {string} uuid - The job UUID
 * @param {string} workerTurkId - The worker's AMT ID
 * @param {Boolean} finishedWithError - An error occurred and the worker clicked the finish button
 */
const forceFinish = (exports.forceFinish = async (
  uuid,
  workerTurkId,
  finishedWithError = false
) => {
  let data = {
    finishedByWorker: true
  };
  let worker = await delegates.workers.getByTurkId(workerTurkId);
  await delegates.tasks.cleanBuffer(uuid, worker.id);

  if (finishedWithError) {
    data = {
      finishedWithError: true
    };
  }
  return await finishAssignment(uuid, worker.id, data);
});

/**
 * Finishes the worker's assignment.
 *
 * @param {string} uuid - The job UUID
 * @param {string} workerId - The worker's ID
 * @param {Object} data - Extra information to add in data column.
 */
const finishAssignment = (exports.finishAssignment = async (
  uuid,
  workerId,
  data = {}
) => {
  return await delegates.workers.updateAssignment(uuid, workerId, {
    finished: true,
    end: new Date(),
    ...data
  });
});
