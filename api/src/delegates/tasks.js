const couchbase = require('couchbase');
const Boom = require('boom');

const bucket = require(__base + 'db').bucket;
const config = require(__base + 'config');
const { DOCUMENTS, TYPES } = require(__base + 'db');
const answersDelegate = require('./answers');
const experimentsDelegate = require('./experiments');
const workersDelegate = require('./workers');

exports.all = async experimentId => {
  try {
    const qs = `select * from \`${config.db.bucket}\` where type="${
      TYPES.task
    }" and experimentId="${experimentId}"`;
    const q = couchbase.N1qlQuery.fromString(qs);
    return await new Promise((resolve, reject) => {
      bucket.query(q, (err, tasks) => {
        if (err) {
          reject(err);
        } else {
          resolve(tasks.map(t => t[config.db.bucket]));
        }
      });
    });
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch tasks');
  }
};

const count = (exports.count = async experimentId => {
  try {
    const qs = `select count(*) as count from \`${
      config.db.bucket
    }\` where type="${TYPES.task}" and experimentId="${experimentId}"`;
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

exports.next = async (experimentId, workerId) => {
  const experiment = await experimentsDelegate.getById(experimentId);
  let key;
  let isInitialTest = false;

  if (!experiment) {
    throw Boom.badRequest('Experiment with the given ID does not exist');
  }

  try {
    const answersCount = await answersDelegate.getWorkerAnswersCount(
      experimentId,
      workerId
    );
    const testCount = await answersDelegate.getWorkerTestAnswersCount(
      experimentId,
      workerId,
      answersDelegate.TestAnswerStrategy.HONEYPOT
    );
    const initialTestCount = await answersDelegate.getWorkerTestAnswersCount(
      experimentId,
      workerId,
      answersDelegate.TestAnswerStrategy.INITIAL
    );

    if (initialTestCount < experiment.initialTestsRule) {
      // create assignment record if it does not exist.
      const assignmentRecord = await workersDelegate.getAssignment(
        experimentId,
        workerId
      );

      if (!assignmentRecord) {
        await workersDelegate.createAssignment(experimentId, workerId);
      }

      // run initial tests
      const ids = await getWorkerAvailableTests(experimentId, workerId);
      const idx = Math.floor(Math.random() * ids.length);
      key = getTaskKey({ experimentId, id: ids[idx] }, true);
      isInitialTest = true;
    } else {
      if (answersCount >= experiment.maxTasksRule) {
        return {
          maxTasks: true
        };
      }
      // check if the worker approved the initial tests
      let initialTestScore = await answersDelegate.getInitialTestScore(
        experimentId,
        workerId
      );

      if (initialTestScore < experiment.initialTestsMinCorrectAnswersRule) {
        await workersDelegate.rejectAssignment(experimentId, workerId);
        return {
          initialTestFailed: true
        };
      }

      const runTest =
        (answersCount + testCount + 1) % (experiment.testFrequencyRule + 1) ===
        0;

      if (runTest) {
        // we need to return a test task
        const testsIds = await getWorkerAvailableTests(experimentId, workerId);
        const idx = Math.floor(Math.random() * testsIds.length);
        key = getTaskKey({ experimentId, id: testsIds[idx] }, true);
      } else {
        const tasksIds = await getWorkerAvailableTasks(experimentId, workerId);
        const idx = Math.floor(Math.random() * tasksIds.length);
        key = getTaskKey({ experimentId, id: tasksIds[idx] });
      }
    }

    let task = await new Promise((resolve, reject) => {
      bucket.get(key, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data.value);
        }
      });
    });

    // create bare answer record
    await answersDelegate.create({
      experimentId,
      task,
      initial: isInitialTest,
      workerId
    });
    return task;
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch next task');
  }
};

/**
 * Returns an array of taskId completed by the worker.
 *
 * @param {Number} experimentId
 * @param {Number} workerId
 */
const getWorkerCompletedTasks = (exports.getWorkerCompletedTasks = async (
  experimentId,
  workerId
) => {
  try {
    const answers = await answersDelegate.getWorkerAnswers(
      experimentId,
      workerId
    );
    return answers.map(a => a.taskId);
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
const getWorkerAvailableTasks = (exports.getWorkerAvailableTasks = async (
  experimentId,
  workerId
) => {
  try {
    let completedTasks = await getWorkerCompletedTasks(experimentId, workerId);
    const qs = `select id from \`${config.db.bucket}\` where type="${
      TYPES.task
    }" and id not in [${completedTasks.map(
      ct => `"${ct}"`
    )}] and experimentId="${experimentId}"`;
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
 * @param {Number} experimentId
 * @param {Number} workerId
 */
const getWorkerAvailableTests = (exports.getWorkerAvailableTests = async (
  experimentId,
  workerId
) => {
  try {
    let completedTests = await getWorkerCompletedTests(experimentId, workerId);
    const qs = `select id from \`${config.db.bucket}\` where type="${
      TYPES.testTask
    }" and id not in [${completedTests.map(
      ct => `"${ct}"`
    )}] and experimentId="${experimentId}"`;
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
 * @param {Number} experimentId
 * @param {Number} workerId
 */
const getWorkerCompletedTests = (exports.getWorkerCompletedTests = async (
  experimentId,
  workerId
) => {
  try {
    const testAnswers = await answersDelegate.getWorkerTestAnswers(
      experimentId,
      workerId
    );
    return testAnswers.map(a => a.testTaskId);
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch completed test');
  }
});

const createTask = (exports.createTask = async (task, isTest = false) => {
  try {
    if (!task.experimentId) {
      throw Boom.badRequest('Task must have experimentId');
    }
    const key = getTaskKey(task, isTest);
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

const getOne = (exports.getOne = async (
  experimentId,
  taskId,
  isTest = false
) => {
  try {
    if (!experimentId) {
      throw Boom.badRequest('Must provide experimentId');
    }
    const key = getTaskKey({ id: taskId, experimentId }, isTest);

    return await new Promise((resolve, reject) => {
      bucket.get(key, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.value);
        }
      });
    });
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch task');
  }
});

const getTaskKey = (task, isTest = false) =>
  `${isTest ? DOCUMENTS.TestTask : DOCUMENTS.Task}${task.experimentId}::${
    task.id
  }`;
