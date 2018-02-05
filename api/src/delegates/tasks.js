const couchbase = require('couchbase');
const Boom = require('boom');

const bucket = require(__base + 'db').bucket;
const config = require(__base + 'config/config.json');
const DOCUMENTS = require(__base + 'db').DOCUMENTS;
const answersDelegate = require('./answers');

exports.all = async () => {
  try {
    const qs = `select * from \`${config.db.bucket}\` where type="task"`;
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
    }\` where type="task"`;
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
    if (answersCount >= config.rules.maxTasks) {
      return {
        maxTasks: true
      };
    }
    const tasksIds = await getWorkerAvailableTasks(workerId);
    const idx = Math.floor(Math.random() * tasksIds.length);

    return await new Promise((resolve, reject) => {
      bucket.get(`${DOCUMENTS.Task}${tasksIds[idx]}`, (err, data) => {
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
    const qs = `select id from \`${
      config.db.bucket
    }\` where type="task" and id not in [${completedTasks}]`;
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
