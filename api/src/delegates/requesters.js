const Boom = require('boom');

const db = require(__base + 'db');
const config = require(__base + 'config');

const getById = (exports.getById = async id => {
  try {
    let res = await db.query(
      `select * from ${db.TABLES.Requester} where id = $1`,
      [id]
    );
    return res.rows[0];
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation(
      'Error while trying to fetch requester information'
    );
  }
});

const getRequesterByGid = (exports.getRequesterByGid = async gid => {
  try {
    let res = await db.query(
      `select * from ${db.TABLES.Requester} where data ->> 'gid' = $1`,
      [gid]
    );
    return res.rows[0];
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation(
      'Error while trying to fetch requester information'
    );
  }
});

const create = (exports.create = async requesterData => {
  try {
    let res = await db.query(
      `insert into ${
        db.TABLES.Requester
      }(created_at, data) values($1, $2) returning *`,
      [new Date(), requesterData]
    );
    return res.rows[0];
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to persist requester');
  }
});

const update = (exports.update = async (id, requester) => {
  try {
    let saved = await getById(id);
    let payload = {
      ...saved.data,
      ...requester.data
    };

    let res = await db.query(
      `update ${
        db.TABLES.Requester
      } set updated_at = $1, data = $2 where id = $3 returning *`,
      [new Date(), payload, id]
    );
    return res.rows[0];
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to update requester');
  }
});
