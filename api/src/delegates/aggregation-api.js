const Boom = require('boom');

const db = require(__base + 'db');

/**
 * Returns all the Aggregation APIs registered by the given requester.
 *
 * @param {Number} id
 */
const getByRequester = (exports.getByRequester = async id => {
  if (!id) {
    throw Boom.badRequest('The requester ID is required');
  }
  let res = await db.query(
    `select * from ${db.TABLES.AggregationApi} where requester_id = $1`,
    [id]
  );
  return { rows: res.rows, meta: { count: res.rowCount } };
});

/**
 * Returns all the Aggregation APIs offered by the platform built-in.
 *
 * @param {Number} id
 */
const getBuiltIn = (exports.getBuiltIn = async id => {
  let res = await db.query(
    `select * from ${db.TABLES.AggregationApi} where requester_id is null`
  );
  return { rows: res.rows, meta: { count: res.rowCount } };
});

/**
 * Returns the aggregation_api record for the given ID.
 *
 * @param {Number} id
 * @return {Object} The aggregation record. Null otherwise.
 */
const getById = (exports.getById = async id => {
  if (!id) {
    throw Boom.badRequest('The ID is required');
  }
  let res = await db.query(
    `select * from ${db.TABLES.AggregationApi} where id = $1`,
    [id]
  );
  return res.rowCount ? res.rows[0] : null;
});

/**
 * Creates a new record in the database.
 *
 * @param {Object} aggregationApi
 * @return {Object}
 */
const create = (exports.create = async aggregationApi => {
  const { requester_id, name, url } = aggregationApi;

  if (!requester_id || !name || !url) {
    throw Boom.badRequest('Required parameters are missing.');
  }

  let rsp = await db.query(
    `insert into ${
      db.TABLES.AggregationApi
    }(created_at, requester_id, name, url) values($1, $2, $3, $4) returning *`,
    [new Date(), requester_id, name, url]
  );
  return rsp.rows[0];
});
