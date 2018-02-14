const couchbase = require('couchbase');
const Boom = require('boom');

const bucket = require(__base + 'db').bucket;
const config = require(__base + 'config');
const { DOCUMENTS, TYPES } = require(__base + 'db');
const answersDelegate = require('./answers');

exports.all = async () => {
  try {
    const qs = `select * from \`${config.db.bucket}\` where type="${
      TYPES.task
    }"`;
    const q = couchbase.N1qlQuery.fromString(qs);
    return await new Promise((resolve, reject) => {
      bucket.query(q, (err, tasks) => {
        if (err) {
          reject(err);
        } else {
          resolve(tasks);
        }
      });
    });
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch tasks');
  }
};

const count = (exports.count = async () => {
  try {
    const qs = `select count(*) as count from \`${
      config.db.bucket
    }\` where type="${TYPES.task}"`;
    const q = couchbase.N1qlQuery.fromString(qs);
    return await new Promise((resolve, reject) => {
      bucket.query(q, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data[0].count);
        }
      });
    });
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch element count');
  }
});

exports.next = async workerId => {
  try {
    const answersCount = await answersDelegate.getWorkerAnswersCount(workerId);
    const testCount = await answersDelegate.getWorkerTestAnswersCount(workerId);

    if (answersCount >= config.rules.maxTasks) {
      return {
        maxTasks: true
      };
    }

    const runTest =
      (answersCount + testCount + 1) % (config.rules.testFrequency + 1) === 0;

    if (runTest) {
      // we need to return a test task
      const testsIds = await getWorkerAvailableTests(workerId);
      const idx = Math.floor(Math.random() * testsIds.length);
      key = `${DOCUMENTS.TestTask}${testsIds[idx]}`;
    } else {
      const tasksIds = await getWorkerAvailableTasks(workerId);
      const idx = Math.floor(Math.random() * tasksIds.length);
      key = `${DOCUMENTS.Task}${tasksIds[idx]}`;
    }

    return await new Promise((resolve, reject) => {
      bucket.get(key, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data.value);
        }
      });
    });
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch next task');
  }
};

/**
 * Returns an array of taskId completed by the worker.
 *
 * @param {Number} workerId
 */
const getWorkerCompletedTasks = (exports.getWorkerCompletedTasks = async workerId => {
  try {
    const answers = await answersDelegate.getWorkerAnswers(workerId);
    return answers.map(a => a[config.db.bucket]).map(a => a.taskId);
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch completed task');
  }
});

/**
 * Returns an array of taskId available to the worker.
 *
 * @param {Number} workerId
 */
const getWorkerAvailableTasks = (exports.getWorkerAvailableTasks = async workerId => {
  try {
    let completedTasks = await getWorkerCompletedTasks(workerId);
    const qs = `select id from \`${config.db.bucket}\` where type="${
      TYPES.task
    }" and id not in [${completedTasks}]`;
    const q = couchbase.N1qlQuery.fromString(qs);
    return await new Promise((resolve, reject) => {
      bucket.query(q, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows.map(a => a.id));
        }
      });
    });
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch available task');
  }
});

/**
 * Returns an array of testId available to the worker.
 *
 * @param {Number} workerId
 */
const getWorkerAvailableTests = (exports.getWorkerAvailableTests = async workerId => {
  try {
    let completedTests = await getWorkerCompletedTests(workerId);
    console.log(completedTests);
    const qs = `select id from \`${config.db.bucket}\` where type="${
      TYPES.testTask
    }" and id not in [${completedTests}]`;
    const q = couchbase.N1qlQuery.fromString(qs);
    return await new Promise((resolve, reject) => {
      bucket.query(q, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows.map(a => a.id));
        }
      });
    });
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation(
      'Error while trying to fetch available test task'
    );
  }
});

/**
 * Returns an array of testId completed by the worker.
 *
 * @param {Number} workerId
 */
const getWorkerCompletedTests = (exports.getWorkerCompletedTests = async workerId => {
  try {
    const testAnswers = await answersDelegate.getWorkerTestAnswers(workerId);
    return testAnswers.map(a => a[config.db.bucket]).map(a => a.testTaskId);
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch completed test');
  }
});

const createTask = (exports.createTask = async (task, isTest = false) => {
  try {
    const key = `${isTest ? DOCUMENTS.TestTask : DOCUMENTS.Task}${task.id}`;
    task.type = isTest ? TYPES.testTask : TYPES.task;

    return await new Promise((resolve, reject) => {
      bucket.insert(key, task, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to persist task');
  }
});
