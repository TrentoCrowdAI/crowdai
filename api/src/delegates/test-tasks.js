const Boom = require('boom');

const db = require(__base + 'db');

const TestAnswerStrategy = (exports.TestAnswerStrategy = Object.freeze({
  ALL: 'ALL',
  INITIAL: 'INITIAL',
  HONEYPOT: 'HONEYPOT'
}));

/**
 * Returns a test_task record for the worker.
 *
 * @param {Number} projectId
 * @param {Number} experimentId
 * @param {Number} workerId
 * @param {Number[]} criteria - Array of criteria IDs assigned to the worker.
 * @private
 */
const createTestTaskForWorker = (exports.createTestTaskForWorker = async (
  projectId,
  experimentId,
  workerId,
  criteria,
  initialTest = false
) => {
  const testRecord = await getTestForWorker(
    projectId,
    experimentId,
    workerId,
    criteria
  );
  return await createTestTask({
    experiment_id: experimentId,
    worker_id: workerId,
    test_id: testRecord.id,
    data: {
      initial: initialTest,
      item: testRecord.data.item,
      criteria: testRecord.data.criteria
    }
  });
});

/**
 * Returns a test record for the worker. It takes into account what test the
 * worker has already answered. It selects the test record randomly.
 *
 * @param {Number} projectId
 * @param {Number} experimentId
 * @param {Number} workerId
 * @param {Number[]} criteria - Array of criteria IDs assigned to the worker.
 */
const getTestForWorker = (exports.getTestForWorker = async (
  projectId,
  experimentId,
  workerId,
  criteria
) => {
  let criteriaFilter = {
    criteria: criteria.map(c => ({ id: c }))
  };
  try {
    let res = await db.query(
      `select t.* from ${
        db.TABLES.Test
      } t where t.project_id = $1 and t.data @> $2 and t.id not in (select id from ${
        db.TABLES.TestTask
      } where experiment_id = $3 and worker_id = $4) order by random() limit 1`,
      [projectId, criteriaFilter, experimentId, workerId]
    );
    return res.rows[0];
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch test record');
  }
});

/**
 * Creates a test_task record
 *
 * @param {Object} testTask
 * @returns {Object}
 */
const createTestTask = (exports.createTestTask = async testTask => {
  try {
    let res = await db.query(
      `insert into ${
        db.TABLES.TestTask
      }(experiment_id, test_id, worker_id, created_at, data) values($1, $2, $3, $4, $5) returning *`,
      [
        testTask.experiment_id,
        testTask.test_id,
        testTask.worker_id,
        new Date(),
        testTask.data
      ]
    );
    return res.rows[0];
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation(
      'Error while trying to create test_task record'
    );
  }
});

/**
 * Returns test_task records that the worker has already answered.
 *
 * @param {Number} experimentId
 * @param {Number} workerId
 * @param {string} strategy
 */
const getWorkerTestTasks = (exports.getWorkerTestTasks = async (
  experimentId,
  workerId,
  strategy = TestAnswerStrategy.ALL
) => {
  try {
    let where = '';

    if (strategy === TestAnswerStrategy.INITIAL) {
      where = "and t.data ->> 'initial' = 'true'";
    } else if (strategy === TestAnswerStrategy.HONEYPOT) {
      where = "and t.data ->> 'initial' = 'false'";
    }

    let res = await db.query(
      `select t.* from ${
        db.TABLES.TestTask
      } t where t.experiment_id = $1 and t.worker_id = $2 and t.data ? 'answered' ${where} order by t.created_at asc`,
      [experimentId, workerId]
    );
    return res.rows[0];
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation(
      "Error while trying to fetch worker's test answers"
    );
  }
});

/**
 * Returns test_task records count that the worker has already answered.
 *
 * @param {Number} experimentId
 * @param {Number} workerId
 * @param {string} strategy
 */
const getWorkerTestTasksCount = (exports.getWorkerTestTasksCount = async (
  experimentId,
  workerId,
  strategy = TestAnswerStrategy.ALL
) => {
  try {
    let where = '';

    if (strategy === TestAnswerStrategy.INITIAL) {
      where = "and t.data ->> 'initial' = 'true'";
    } else if (strategy === TestAnswerStrategy.HONEYPOT) {
      where = "and t.data ->> 'initial' = 'false'";
    }

    let res = await db.query(
      `select count(t.*) from ${
        db.TABLES.TestTask
      } t where t.experiment_id = $1 and t.worker_id = $2 and t.data ? 'answered' ${where}`,
      [experimentId, workerId]
    );
    return Number(res.rows[0].count);
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation(
      "Error while trying to fetch worker's test answers count"
    );
  }
});

const getInitialTestScore = (exports.getInitialTestScore = async (
  experiment,
  workerId
) => {
  let testTasks = await getWorkerTestTasks(
    experiment.id,
    workerId,
    TestAnswerStrategy.INITIAL
  );

  try {
    let count = 0;

    for (task of testTasks) {
      let score = task.data.criteria.reduce(
        (sum, criterion) =>
          criterion.answer === criterion.workerAnswer ? sum + 1 : sum,
        0
      );

      if (score === task.data.criteria.length) {
        ++count;
      }
    }
    return count / experiment.data.initialTestsRule * 100;
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation(
      "Error while trying to compute worker's initial test score"
    );
  }
});

/**
 * Check if worker correctly answered last honeypot test.
 *
 * @param {Number} experimentId
 * @param {Number} workerId
 * @returns {Boolean}
 */
const checkLastHoneypot = (exports.checkLastHoneypot = async (
  experimentId,
  workerId
) => {
  let testTasks = await getWorkerTestTasks(
    experimentId,
    workerId,
    TestAnswerStrategy.HONEYPOT
  );

  try {
    if (testTasks.length === 0) {
      return true;
    }
    // we just pick the most recent answer.
    let task = testTasks[testTasks.length - 1];
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
});

const getTestTaskById = (exports.getTestTaskById = async id => {
  try {
    let res = await db.query(
      `select * from ${db.TABLES.TestTask} where id = $1`,
      [id]
    );
    return res.rowCount > 0 ? res.rows[0] : null;
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch record');
  }
});

/**
 * Overrides data column for the given test_task.
 *
 * @param {Object} testTask
 */
const updateTestTask = (exports.updateTestTask = async testTask => {
  try {
    let res = await db.query(
      `update ${
        db.TABLES.TestTask
      } set updated_at = $1, data = $2 where id = $3 returning *`,
      [new Date(), testTask.data, testTask.id]
    );
    return res.rows[0];
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to update record');
  }
});
