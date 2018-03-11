const Boom = require('boom');

const db = require(__base + 'db');
const config = require(__base + 'config');
const projectsDelegate = require('./projects');
const itemsDelegate = require('./items');

/**
 * Returns a task record for the worker.
 *
 * @param {Number} projectId
 * @param {Number} experimentId
 * @param {Number} workerId
 * @param {Number[]} criteria - Array of criterion IDs assigned to the worker.
 * @private
 */
const createTaskForWorker = (exports.createTaskForWorker = async (
  projectId,
  experimentId,
  workerId,
  criteria
) => {
  const itemRecord = await itemsDelegate.getItemForWorker(
    projectId,
    experimentId,
    workerId
  );
  const criterionRecords = await projectsDelegate.getCriteriaFromIds(criteria);

  return await createTask({
    experiment_id: experimentId,
    worker_id: workerId,
    item_id: itemRecord.id,
    data: {
      item: itemRecord,
      criteria: criterionRecords.rows
    }
  });
});

/**
 * Creates a task record.
 *
 * @param {Object} task
 * @returns {Object}
 */
const createTask = (exports.createTask = async task => {
  try {
    let res = await db.query(
      `insert into ${
        db.TABLES.Task
      }(experiment_id, item_id, worker_id, created_at, data) values($1, $2, $3, $4, $5) returning *`,
      [task.experiment_id, task.item_id, task.worker_id, new Date(), task.data]
    );
    return res.rows[0];
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to create task record');
  }
});

const getTaskById = (exports.getTaskById = async id => {
  try {
    let res = await db.query(`select * from ${db.TABLES.Task} where id = $1`, [
      id
    ]);
    return res.rowCount > 0 ? res.rows[0] : null;
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch record');
  }
});

/**
 * Overrides data column for the given task.
 *
 * @param {Object} task
 */
const updateTask = (exports.updateTask = async task => {
  try {
    let res = await db.query(
      `update ${
        db.TABLES.Task
      } set updated_at = $1, data = $2 where id = $3 returning *`,
      [new Date(), task.data, task.id]
    );
    return res.rows[0];
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to update record');
  }
});
