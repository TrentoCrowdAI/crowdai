const Boom = require('boom');

const db = require(__base + 'db');
const delegates = require(__base + 'delegates');
const { TestTaskType } = delegates.testTasks;

/**
 * Returns a test task for the worker. It can be an initial test or a honeypot test.
 * It takes into account what test the worker has already answered.
 * It selects the test record randomly.
 *
 * @param {Object} job
 * @param {Object} worker
 * @param {Number[]} criteria - Array of criteria IDs assigned to the worker.
 * @param {Boolean} initialTest
 * @private
 */
const getTestForWorker = (exports.getTestForWorker = async (
  job,
  worker,
  criteria,
  initialTest = false
) => {
  const testRecord = await delegates.testTasks.getAvailableTestForWorker(
    job.project_id,
    job.id,
    worker.id,
    criteria
  );

  if (testRecord.test_id) {
    return testRecord;
  }
  return await delegates.testTasks.createTestTask({
    job_id: job.id,
    worker_id: worker.id,
    test_id: testRecord.id,
    data: {
      initial: initialTest,
      item: testRecord.data.item,
      criteria: testRecord.data.criteria,
      answered: false,
      start: new Date()
    }
  });
});

/**
 * Verify the status of the worker's assignment. If initial quiz is done, it
 * check the worker's answers. It also evaluates honeypots.
 */
const checkWorkerAssignment = (exports.checkWorkerAssignment = async (
  job,
  worker,
  assignment
) => {
  try {
    let quizNeeded = await shouldRunInitialTest(job, worker);

    if (quizNeeded) {
      return assignment;
    }
    // check if the worker approved the initial tests
    let quizScore = await getWorkerQuizScore(job, worker);

    if (quizScore < job.data.initialTestsMinCorrectAnswersRule) {
      return await rejectAssignment(job, worker, {
        initialTestFailed: true
      });
    }
    // check if the worker approved the previous honeypot
    const honeypotApproved = await checkLastHoneypot(job, worker);

    if (!honeypotApproved) {
      return await rejectAssignment(job, worker, {
        honeypotFailed: true
      });
    }
    return assignment;
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation(
      "Error while trying to check the worker's assignment status"
    );
  }
});

/**
 *
 * @param {Object} job
 * @param {Object} worker
 */
const shouldRunInitialTest = (exports.shouldRunInitialTest = async (
  job,
  worker
) => {
  const quizAnswersCount = await delegates.testTasks.getWorkerTestTasksCount(
    job.id,
    worker.id,
    TestTaskType.INITIAL
  );

  return quizAnswersCount < job.data.initialTestsRule;
});

const getWorkerQuizScore = async (job, worker) => {
  let testTasks = await delegates.testTasks.getWorkerTestTasks(
    job.id,
    worker.id,
    TestTaskType.INITIAL
  );

  try {
    let count = 0;

    for (task of testTasks.rows) {
      let score = task.data.criteria.reduce(
        (sum, criterion) =>
          criterion.answer === criterion.workerAnswer ? sum + 1 : sum,
        0
      );

      if (score === task.data.criteria.length) {
        ++count;
      }
    }
    return count / job.data.initialTestsRule * 100;
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation(
      "Error while trying to compute worker's initial test score"
    );
  }
};

const shouldRunHoneypot = (exports.shouldRunHoneypot = async (job, worker) => {
  const answersCount = await delegates.tasks.getWorkerTasksCount(
    job.id,
    worker.id
  );
  const testCount = await delegates.testTasks.getWorkerTestTasksCount(
    job.id,
    worker.id,
    TestTaskType.HONEYPOT
  );
  const runHoneypot =
    (answersCount + testCount + 1) % (job.data.testFrequencyRule + 1) === 0;

  return runHoneypot;
});

/**
 * Check if worker correctly answered last honeypot test.
 *
 * @param {Object} job
 * @param {Object} worker
 * @returns {Boolean}
 */
const checkLastHoneypot = async (job, worker) => {
  let testTasks = await delegates.testTasks.getWorkerTestTasks(
    job.id,
    worker.id,
    TestTaskType.HONEYPOT
  );

  try {
    if (testTasks.meta.count === 0) {
      return true;
    }
    // we just pick the most recent answer.
    let task = testTasks.rows[testTasks.meta.count - 1];
    let score = task.data.criteria.reduce(
      (sum, criterion) =>
        criterion.answer === criterion.workerAnswer ? sum + 1 : sum,
      0
    );
    return score === task.data.criteria.length;
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation(
      "Error while trying to check worker's last honeypot answer"
    );
  }
};

/**
 * Rejects the worker's assignment.
 *
 * @param {Object} job - The job
 * @param {Object} worker - The worker
 * @param {Object} data - Attributes to add in dat column.
 */
const rejectAssignment = async (job, worker, data) => {
  try {
    return await delegates.workers.updateAssignment(job.uuid, worker.id, {
      ...data,
      finished: true,
      end: new Date()
    });
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to reject assignment');
  }
};
