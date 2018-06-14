const Boom = require('boom');

const db = require(__base + 'db');

/**
 * Returns all Task Assignment APIs registered by the given requester.
 *
 * @param {Number} id
 */
const getByRequester = (exports.getByRequester = async id => {
  if (!id) {
    throw Boom.badRequest('The requester ID is required');
  }
  let res = await db.query(
    `select * from ${db.TABLES.TaskAssignmentApi} where requester_id = $1`,
    [id]
  );
  return { rows: res.rows, meta: { count: res.rowCount } };
});

/**
 * Returns all Task Assignment APIs offered by the platform built-in.
 *
 * @param {Number} id
 */
const getBuiltIn = (exports.getBuiltIn = async id => {
  try {
    let res = await db.query(
      `select * from ${db.TABLES.TaskAssignmentApi} where requester_id is null`
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

/**
 * Creates a new record in the database.
 *
 * @param {Object} taskAssignmentApi
 * @return {Object}
 */
const create = (exports.create = async taskAssignmentApi => {
  const { requester_id, name, url, aggregation } = taskAssignmentApi;

  if (!requester_id || !name || !url) {
    throw Boom.badRequest('Required parameters are missing.');
  }

  let rsp = await db.query(
    `insert into ${
      db.TABLES.TaskAssignmentApi
    }(created_at, requester_id, name, url, aggregation) values($1, $2, $3, $4, $5) returning *`,
    [new Date(), requester_id, name, url, aggregation]
  );
  return rsp.rows[0];
});
