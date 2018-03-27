const db = require(__base + 'db');

/**
 * Returns all Task Assignment APIs registered by the given requester. It also
 * includes the one offered by the platform built-in
 *
 * @param {Number} id
 */
const getByRequester = (exports.getByRequester = async id => {
  try {
    let res = await db.query(
      `select * from ${
        db.TABLES.TaskAssignmentApi
      } where requester_id = $1 or requester_id is null`,
      [id]
    );
    return { rows: res.rows, meta: { count: res.rowCount } };
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch records');
  }
});

/**
 * Returns the task assignment record for the given ID.
 *
 * @param {Number} id
 */
const getById = (exports.getById = async id => {
  try {
    let res = await db.query(
      `select * from ${db.TABLES.TaskAssignmentApi} where id = $1`,
      [id]
    );
    return res.rowCount ? res.rows[0] : null;
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch records');
  }
});
