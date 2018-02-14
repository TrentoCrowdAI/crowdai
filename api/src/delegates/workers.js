const Boom = require('boom');
const couchbase = require('couchbase');

const bucket = require(__base + 'db').bucket;
const config = require(__base + 'config');
const answersDelegate = require('./answers');
const { DOCUMENTS, TYPES } = require(__base + 'db');

const getWorkerReward = (exports.getWorkerReward = async (
  experimentId,
  workerId
) => {
  try {
    const taskCount = await answersDelegate.getWorkerAnswersCount(
      experimentId,
      workerId
    );
    const testCount = await answersDelegate.getWorkerTestAnswersCount(
      experimentId,
      workerId
    );
    return { reward: (taskCount + testCount) * config.rules.taskReward };
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while computing reward');
  }
});

const finishAssignment = (exports.finishAssignment = async (
  experimentId,
  workerId
) => {
  try {
    const key = getWorkerAssignmentKey(experimentId, workerId);
    let record = {
      type: TYPES.assignment,
      finished: true,
      workerId,
      experimentId
    };
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

const checkAssignmentStatus = (exports.checkAssignmentStatus = async (
  experimentId,
  workerId
) => {
  try {
    return await new Promise((resolve, reject) => {
      bucket.get(
        getWorkerAssignmentKey(experimentId, workerId),
        (err, data) => {
          if (err) {
            if (err.code === couchbase.errors.keyNotFound) {
              resolve({ finished: false });
            } else {
              reject(err);
            }
          } else {
            resolve({ finished: data.value.finished });
          }
        }
      );
    });
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation(
      'Error while trying to check assignment status'
    );
  }
});

const getWorkerAssignmentKey = (experimentId, workerId) =>
  `${DOCUMENTS.WorkerAssignment}${experimentId}::${workerId}`;
