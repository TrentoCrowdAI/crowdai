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
  let criterionRecords = await projectsDelegate.getCriteriaFromIds(criteria);

  const flattenedCriteria = criterionRecords.rows.map(c => ({
    id: c.id,
    label: c.data.label,
    description: c.data.description
  }));

  const flattenedItems = {
    title: itemRecord.data.title,
    description: itemRecord.data.description
  };

  return await createTask({
    experiment_id: experimentId,
    worker_id: workerId,
    item_id: itemRecord.id,
    data: {
      item: flattenedItems,
      criteria: flattenedCriteria
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
 * @param {Number} id
 * @param {Object} taskData
 */
const updateTask = (exports.updateTask = async (id, taskData) => {
  try {
    let res = await db.query(
      `update ${
        db.TABLES.Task
      } set updated_at = $1, data = $2 where id = $3 returning *`,
      [new Date(), taskData, id]
    );
    return res.rows[0];
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to update record');
  }
});

/**
 * Returns the number of task records that the worker has already answered.
 *
 * @param {Number} experimentId
 * @param {Number} workerId
 */
const getWorkerTasks = (exports.getWorkerTasks = async (
  experimentId,
  workerId
) => {
  try {
    let res = await db.query(
      `select t.* from ${
        db.TABLES.Task
      } t where t.experiment_id = $1 and t.worker_id = $2 and t.data ? 'answered'`,
      [experimentId, workerId]
    );
    return { rows: res.rows, meta: { count: res.rowCount } };
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation(
      "Error while trying to fetch worker's test answers count"
    );
  }
});

/**
 * Returns the number of task records that the worker has already answered.
 *
 * @param {Number} experimentId
 * @param {Number} workerId
 */
const getWorkerTasksCount = (exports.getWorkerTasksCount = async (
  experimentId,
  workerId
) => {
  try {
    let res = await db.query(
      `select count(t.*) from ${
        db.TABLES.Task
      } t where t.experiment_id = $1 and t.worker_id = $2 and t.data ? 'answered'`,
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
