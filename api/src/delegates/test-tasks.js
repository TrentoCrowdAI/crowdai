const Boom = require('boom');

const db = require(__base + 'db');

const TestTaskType = (exports.TestTaskType = Object.freeze({
  ALL: 'ALL',
  INITIAL: 'INITIAL',
  HONEYPOT: 'HONEYPOT'
}));

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
      }(job_id, test_id, worker_id, created_at, data) values($1, $2, $3, $4, $5) returning *`,
      [
        testTask.job_id,
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
 * @param {Number} jobId
 * @param {Number} workerId
 * @param {string} strategy
 */
const getWorkerTestTasks = (exports.getWorkerTestTasks = async (
  jobId,
  workerId,
  type = TestTaskType.ALL
) => {
  try {
    let where = '';

    if (type === TestTaskType.INITIAL) {
      where = "and t.data ->> 'initial' = 'true'";
    } else if (type === TestTaskType.HONEYPOT) {
      where = "and t.data ->> 'initial' = 'false'";
    }

    let res = await db.query(
      `select t.* from ${
        db.TABLES.TestTask
      } t where t.job_id = $1 and t.worker_id = $2 and t.data ->> 'answered' = 'true' ${where} order by t.created_at asc`,
      [jobId, workerId]
    );
    return { rows: res.rows, meta: { count: res.rowCount } };
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
 * @param {Number} jobId
 * @param {Number} workerId
 * @param {string} strategy
 */
const getWorkerTestTasksCount = (exports.getWorkerTestTasksCount = async (
  jobId,
  workerId,
  strategy = TestTaskType.ALL
) => {
  try {
    let where = '';

    if (strategy === TestTaskType.INITIAL) {
      where = "and t.data ->> 'initial' = 'true'";
    } else if (strategy === TestTaskType.HONEYPOT) {
      where = "and t.data ->> 'initial' = 'false'";
    }

    let res = await db.query(
      `select count(t.*) from ${
        db.TABLES.TestTask
      } t where t.job_id = $1 and t.worker_id = $2 and t.data ->> 'answered' = 'true' ${where}`,
      [jobId, workerId]
    );
    return Number(res.rows[0].count);
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation(
      "Error while trying to fetch worker's test answers count"
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
 * @param {Number} id
 * @param {Object} testTaskData
 */
const updateTestTask = (exports.updateTestTask = async (id, testTaskData) => {
  try {
    let res = await db.query(
      `update ${
        db.TABLES.TestTask
      } set updated_at = $1, data = $2 where id = $3 returning *`,
      [new Date(), testTaskData, id]
    );
    return res.rows[0];
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to update record');
  }
});

/**
 * Returns a test record for the worker. if there is a test record already generated but without answer,
 * then we just return the record.
 *
 * @param {Number} projectId
 * @param {Number} jobId
 * @param {Number} workerId
 * @param {Number[]} criteria
 * @returns {Object} a test record or test task record.
 */
const getAvailableTestForWorker = (exports.getAvailableTestForWorker = async (
  projectId,
  jobId,
  workerId,
  criteria
) => {
  try {
    // first we check if there is a test record already generated and without answer
    let res = await db.query(
      `select * from ${
        db.TABLES.TestTask
      } where job_id = $1 and worker_id = $2 and  data ->> 'answered' = 'false' limit 1`,
      [jobId, workerId]
    );

    if (res.rowCount > 0) {
      return res.rows[0];
    }
    let criteriaFilter = {
      criteria: criteria.map(c => ({ id: c }))
    };
    res = await db.query(
      `select t.* from ${
        db.TABLES.Test
      } t where t.project_id = $1 and t.data @> $2 and t.id not in (select test_id from ${
        db.TABLES.TestTask
      } where job_id = $3 and worker_id = $4) order by random() limit 1`,
      [projectId, criteriaFilter, jobId, workerId]
    );
    return res.rows[0];
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to update record');
  }
});
