const Boom = require('boom');
const couchbase = require('couchbase');

const bucket = require(__base + 'db').bucket;
const config = require(__base + 'config');
const answersDelegate = require('./answers');
const { DOCUMENTS, TYPES } = require(__base + 'db');
const experimentsDelegate = require('./experiments');

const getWorkerReward = (exports.getWorkerReward = async (
  experimentId,
  workerId
) => {
  const experiment = await experimentsDelegate.getById(experimentId);

  if (!experiment) {
    throw Boom.badRequest('Experiment with the given ID does not exist');
  }

  try {
    const taskCount = await answersDelegate.getWorkerAnswersCount(
      experimentId,
      workerId
    );
    const testCount = await answersDelegate.getWorkerTestAnswersCount(
      experimentId,
      workerId
    );
    const assignment = await getAssignment(experimentId, workerId);

    if (assignment.initialTestFailed) {
      return { reward: 0 };
    }
    return { reward: (taskCount + testCount) * experiment.taskRewardRule };
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
    return await updateAssignment(experimentId, workerId, {
      finished: true,
      assignmentEnd: new Date()
    });
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to finish assignment');
  }
});

/**
 * Updates the given assignment.
 *
 * @param {string} experimentId
 * @param {string} workerId
 * @param {Object} assignment - The assignment with attributes updated.
 */
const updateAssignment = (exports.updateAssignment = async (
  experimentId,
  workerId,
  assignment
) => {
  try {
    const key = getWorkerAssignmentKey(experimentId, workerId);
    let record = await getAssignment(experimentId, workerId);
    record = {
      ...record,
      ...assignment
    };

    return await new Promise((resolve, reject) => {
      bucket.upsert(key, record, (error, result) => {
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
    throw Boom.badImplementation(
      'Error while trying to check assignment status'
    );
  }
});

const checkAssignmentStatus = (exports.checkAssignmentStatus = async (
  experimentId,
  workerId
) => {
  try {
    return await getAssignment(experimentId, workerId);
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation(
      'Error while trying to check assignment status'
    );
  }
});

const getAssignment = (exports.getAssignment = async (
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
              resolve(null);
            } else {
              reject(err);
            }
          } else {
            resolve(data.value);
          }
        }
      );
    });
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation(
      'Error while trying to fetch assignment record'
    );
  }
});

/**
 * Initializes the assignment record.
 *
 * @param {string} experimentId
 * @param {string} workerId
 */
const createAssignment = (exports.createAssignment = async (
  experimentId,
  workerId
) => {
  const key = getWorkerAssignmentKey(experimentId, workerId);
  let record = {
    type: TYPES.assignment,
    finished: false,
    workerId,
    experimentId,
    initialTestFailed: false,
    honeypotFailed: false,
    assignmentStart: new Date()
  };

  try {
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
    throw Boom.badImplementation(
      'Error while trying to create assignment record'
    );
  }
});

const rejectAssignment = (exports.rejectAssignment = async (
  experimentId,
  workerId
) => {
  try {
    return await updateAssignment(experimentId, workerId, {
      initialTestFailed: true,
      assignmentEnd: new Date()
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
