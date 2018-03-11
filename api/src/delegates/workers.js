const Boom = require('boom');

const db = require(__base + 'db');
const config = require(__base + 'config');
const tasksDelegate = require('./tasks');
const testTasksDelegate = require('./test-tasks');
const experimentsDelegate = require('./experiments');

const RejectionType = (exports.RejectionType = Object.freeze({
  INITIAL: 'INITIAL',
  HONEYPOT: 'HONEYPOT'
}));

const getByTurkId = (exports.getByTurkId = async turkId => {
  try {
    let res = await db.query(
      `select * from ${db.TABLES.Worker} where turk_id = $1`,
      [turkId]
    );
    return res.rowCount > 0 ? res.rows[0] : null;
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch worker');
  }
});

const create = (exports.create = async turkId => {
  try {
    let res = await db.query(
      `insert into ${
        db.TABLES.Worker
      }(turk_id, created_at) values($1, $2) returning *`,
      [turkId, new Date()]
    );
    return res.rowCount > 0 ? res.rows[0] : null;
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to create worker');
  }
});

/**
 * Computes the worker's reward based on the answer given. If asBonus
 * is true, then we subtract experiment.data.taskRewardRule from the reward
 * so that we can pay the resulting amount to the worker as the bonus.
 *
 * @param {string} uuid - The experiment UUID
 * @param {string} turkId - Worker's AMT ID
 * @param {boolean} asBonus
 */
const getWorkerReward = (exports.getWorkerReward = async (
  uuid,
  turkId,
  asBonus = false
) => {
  const experiment = await experimentsDelegate.getByUuid(uuid);

  if (!experiment) {
    throw Boom.badRequest('Experiment with the given ID does not exist');
  }

  try {
    const worker = await getByTurkId(turkId);
    const workerId = worker.id;
    const taskCount = await tasksDelegate.getWorkerTasksCount(
      experiment.id,
      workerId
    );
    const testCount = await testTasksDelegate.getWorkerTestTasksCount(
      experiment.id,
      workerId
    );
    const assignment = await getAssignment(uuid, workerId);

    if (!assignment || assignment.data.initialTestFailed) {
      return { reward: 0 };
    }
    // the total amount that we pay to a worker is HIT reward + bonus. Therefore we
    // should subtract 1 in order to pay the worker using the reward + bonus strategy.
    const delta = asBonus ? -1 : 0;
    return {
      reward: (taskCount + testCount + delta) * experiment.data.taskRewardRule
    };
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while computing reward');
  }
});

/**
 * Finishes worker's assignment.
 *
 * @param {string} uuid - The experiment UUID
 * @param {string} turkId - Worker's AMT ID
 */
const finishAssignment = (exports.finishAssignment = async (uuid, turkId) => {
  try {
    let worker = await getByTurkId(turkId);
    return await updateAssignment(uuid, worker.id, {
      finished: true,
      assignmentEnd: new Date()
    });
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to finish assignment');
  }
});

/**
 * Updates assigment data column.
 *
 * @param {string} uuid - The experiment UUID
 * @param {string} workerId
 * @param {Object} assignmentData - Attributes to update in data column
 */
const updateAssignment = (exports.updateAssignment = async (
  uuid,
  workerId,
  assignmentData
) => {
  try {
    let assigment = await getAssignment(uuid, workerId);
    assigment.data = {
      ...assigment.data,
      ...assignmentData
    };
    let res = await db.query(
      `update ${
        db.TABLES.WorkerAssignment
      } set updated_at = $1, data = $2 where id = $3 returning *`,
      [new Date(), assigment.data, assigment.id]
    );
    return res.rows[0];
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation(
      'Error while trying to check assignment status'
    );
  }
});

/**
 * Verify the status of the worker's assignment.
 *
 * @param {string} uuid - The experiment UUID
 * @param {string} turkId - Worker's AMT ID
 */
const checkAssignmentStatus = (exports.checkAssignmentStatus = async (
  uuid,
  turkId
) => {
  try {
    const worker = await getByTurkId(turkId);
    return await getAssignment(uuid, worker.id);
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation(
      'Error while trying to check assignment status'
    );
  }
});

/**
 * Returns the worker_assigment record
 *
 * @param {string} uuid - The experiment's UUID
 * @param {string} workerId
 */
const getAssignment = (exports.getAssignment = async (uuid, workerId) => {
  try {
    const res = await db.query(
      `select * from ${
        db.TABLES.WorkerAssignment
      } where experiment_uuid = $1 and worker_id = $2`,
      [uuid, workerId]
    );
    return res.rowCount > 0 ? res.rows[0] : null;
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
 * @param {Object} assignment
 */
const createAssignment = (exports.createAssignment = async assignment => {
  let data = {
    ...assignment.data,
    finished: false,
    initialTestFailed: false,
    honeypotFailed: false,
    assignmentStart: new Date()
  };

  try {
    let res = await db.query(
      `insert into ${
        db.TABLES.WorkerAssignment
      }(experiment_id, experiment_uuid, worker_id, created_at, data) values($1, $2, $3, $4, $5) returning *`,
      [
        assignment.experimentId,
        assignment.experimentUuid,
        assignment.workerId,
        new Date(),
        data
      ]
    );
    return res.rows[0];
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation(
      'Error while trying to create assignment record'
    );
  }
});

/**
 * Verify the status of the worker's assignment.
 *
 * @param {string} uuid - The experiment UUID
 * @param {string} turkId - Worker's AMT ID
 */
const rejectAssignment = (exports.rejectAssignment = async (
  uuid,
  turkId,
  rejectionType
) => {
  try {
    let worker = await getByTurkId(turkId);
    return await updateAssignment(uuid, worker.id, {
      initialTestFailed: rejectionType === RejectionType.INITIAL,
      honeypotFailed: rejectionType === RejectionType.HONEYPOT,
      finished: true,
      assignmentEnd: new Date()
    });
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation(
      'Error while trying to check assignment status'
    );
  }
});
