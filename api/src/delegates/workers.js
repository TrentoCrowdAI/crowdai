const Boom = require('boom');
const couchbase = require('couchbase');

const bucket = require(__base + 'db').bucket;
const config = require(__base + 'config/config.json');
const answersDelegate = require('./answers');
const { DOCUMENTS, TYPES } = require(__base + 'db');

const getWorkerReward = (exports.getWorkerReward = async workerId => {
  try {
    const taskCount = await answersDelegate.getWorkerAnswersCount(workerId);
    const testCount = await answersDelegate.getWorkerTestAnswersCount(workerId);
    return { reward: (taskCount + testCount) * config.rules.taskReward };
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while computing reward');
  }
});

const finishAssignment = (exports.finishAssignment = async workerId => {
  try {
    const key = `${DOCUMENTS.WorkerAssignment}${workerId}`;
    let record = { type: TYPES.assignment, finished: true, workerId };
    return await new Promise((resolve, reject) => {
      bucket.insert(key, record, (error, result) => {
        if (error) {
          console.error(
            `Error while inserting document ${key}. Error: ${error}`
          );
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to finish assignment');
  }
});

const checkAssignmentStatus = (exports.checkAssignmentStatus = async workerId => {
  try {
    return await new Promise((resolve, reject) => {
      bucket.get(`${DOCUMENTS.WorkerAssignment}${workerId}`, (err, data) => {
        if (err) {
          if (err.code === couchbase.errors.keyNotFound) {
            resolve({ finished: false });
          } else {
            reject(err);
          }
        } else {
          resolve({ finished: data.value.finished });
        }
      });
    });
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation(
      'Error while trying to check assignment status'
    );
  }
});
