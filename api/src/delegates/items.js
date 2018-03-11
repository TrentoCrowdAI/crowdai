const Boom = require('boom');

const db = require(__base + 'db');

/**
 * Returns an item record for the worker. It takes into account what (item, criteria)
 * tasks the worker has already answered. It selects the item record randomly.
 *
 * @param {Number} projectId
 * @param {Number} experimentId
 * @param {Number} workerId
 * @returns {Object} an item record.
 */
const getItemForWorker = (exports.getItemForWorker = async (
  projectId,
  experimentId,
  workerId
) => {
  try {
    let res = await db.query(
      `select i.* from ${
        db.TABLES.Item
      } i where i.project_id = $1 and i.id not in (select t.id from ${
        db.TABLES.Task
      } t where t.experiment_id = $2 and worker_id = $3) order by random() limit 1`,
      [projectId, experimentId, workerId]
    );
    return res.rows[0];
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch item record');
  }
});
