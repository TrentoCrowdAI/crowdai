const Boom = require('boom');

const db = require(__base + 'db');

/**
 * Returns the items based on the ID list.
 *
 * @param {Number[]} items - Array of item IDs.
 * @return {Object[]}
 */
const getItemsFromIds = (exports.getItemsFromIds = async items => {
  try {
    let res = await db.query(
      `select * from ${db.TABLES.Item} where id = ANY ($1)`,
      [items]
    );
    return res.rowCount > 0 ? res.rows : null;
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch records');
  }
});
