const delegates = require(__base + 'delegates');
const qualityManager = require('./quality');

/**
 * Verify the status of the worker's assignment. If initial quiz is done, it
 * checks the worker's answers. It also evaluates honeypots.
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

  if (answersCount === job.data.maxTasksRule) {
    return await finishAssignment(job.uuid, worker.id, {
      finished: true
    });
  }
  const solvedMinTasks = await checkWorkerSolvedMinTasks(job, worker);

  if (solvedMinTasks) {
    assignment = await delegates.workers.updateAssignment(job.uuid, worker.id, {
      solvedMinTasks
    });
  }

  // check if initial quiz applies
  let quizNeeded = await qualityManager.shouldRunInitialTest(job, worker);

  if (quizNeeded) {
    return assignment;
  }
  // check if the worker approved the initial quiz
  let quizScore = await qualityManager.getWorkerQuizScore(job, worker);

  if (quizScore < job.data.initialTestsMinCorrectAnswersRule) {
    return await rejectAssignment(job, worker, {
      initialTestFailed: true
    });
  }
  // check if the worker approved the previous honeypot
  const honeypotApproved = await qualityManager.checkLastHoneypot(job, worker);

  if (!honeypotApproved) {
    return await rejectAssignment(job, worker, {
      honeypotFailed: true
    });
  }
  return assignment;
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
    end: new Date(),
    ...data
  });
});

/**
 * Rejects the worker's assignment.
 *
 * @param {Object} job - The job
 * @param {Object} worker - The worker
 * @param {Object} data - Attributes to add in the data column of the worker_assignment record.
 */
const rejectAssignment = (exports.rejectAssignment = async (
  job,
  worker,
  data
) => {
  try {
    return await delegates.workers.updateAssignment(job.uuid, worker.id, {
      ...data,
      end: new Date()
    });
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to reject assignment');
  }
});

/**
 * Checks if the worker answered the min number of tasks specified
 * in the minTasksRule property of a job.
 *
 * @param {Object} job
 * @param {Object} worker
 * @return {Boolean}
 */
const checkWorkerSolvedMinTasks = (exports.checkWorkerSolvedMinTasks = async (
  job,
  worker
) => {
  const count = await delegates.tasks.getWorkerTasksCount(job.id, worker.id);
  const buffer = await delegates.tasks.getBuffer(job.id, worker.id);

  // if the number of tasks generated for the worker is less than the minimum
  // we just check that the worker answered all of them.
  if (!buffer && count > 0 && count < job.data.minTasksRule) {
    return true;
  }
  return count >= job.data.minTasksRule;
});
