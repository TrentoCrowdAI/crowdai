/**
 * Internal module that manage the project table. We use this table
 * to keep a single reference to items, tests and filters records. So
 * that we can related them across multiple jobs.
 */
const Boom = require('boom');
const request = require('request');
const csv = require('csv-parser');
const QueryStream = require('pg-query-stream');

const db = require(__base + 'db');
const tasksDelegate = require('./tasks');
const { emit } = require(__base + 'events/emitter');
const { EventTypes } = require(__base + 'events/types');

const getById = (exports.getById = async id => {
  try {
    let res = await db.query(
      `select * from ${db.TABLES.Project} where id = $1`,
      [id]
    );
    const project = res.rows[0];

    if (!project) {
      throw Boom.badRequest(`The project with id ${id} does not exist.`);
    }
    return project;
  } catch (error) {
    console.error(error);

    if (error.isBoom) {
      throw error;
    }
    throw Boom.badImplementation('Error while trying to fetch the record');
  }
});

/**
 * Creates a new project record.
 *
 * @param {String} itemsUrl - The URL to a CSV file containing the items to create.
 * @param {String} testsUrl - The URL to a CSV file containing the tests to create.
 * @param {Object[]} criteria - An array of criterion.
 */
const create = (exports.create = async (itemsUrl, testsUrl, criteria) => {
  if (!itemsUrl || !testsUrl || !criteria || !criteria.length > 0) {
    throw Boom.badRequest('All parameters are required');
  }
  let data = {
    itemsUrl,
    testsUrl,
    itemsCreated: false,
    testsCreated: false
  };

  try {
    await db.query('BEGIN');
    let res = await db.query(
      `insert into ${
        db.TABLES.Project
      }(created_at, data) values($1, $2) returning *`,
      [new Date(), data]
    );
    const created = res.rows[0];

    for (criterion of criteria) {
      await db.query(
        `insert into ${
          db.TABLES.Criterion
        }(created_at, project_id, data) values($1, $2, $3)`,
        [new Date(), created.id, criterion]
      );
    }
    await db.query('COMMIT');
    emit(EventTypes.project.PROCESS_CSV, created, false);
    return created;
  } catch (error) {
    console.error(error);
    await db.query('ROLLBACK');
    throw Boom.badImplementation('Error while trying to persist the record');
  }
});

/**
 * Returns the number of jobs associated with the given project.
 *
 * @param {Number} id - The project ID.
 * @return {Number}
 */
const getJobsCount = (exports.getJobsCount = async id => {
  try {
    let res = await db.query(
      `select count(*) as count from  ${db.TABLES.Job} where project_id = $1`,
      [id]
    );
    return res.rows[0].count;
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch the count');
  }
});

/**
 * Returns the items that are associated with the given project.
 *
 * @param {Number} projectId
 * @return {QueryStream} stream-like cursor to iterate over the rows.
 */
const getItemsQS = (exports.getItems = async projectId => {
  try {
    const query = new QueryStream(
      `select * from  ${db.TABLES.Item} where project_id = $1`,
      [projectId]
    );
    const stream = await db.query(query);
    return stream;
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch project items');
  }
});

/**
 * Returns the number of items that are associated with the given project.
 *
 * @param {Number} projectId
 * @return {Number}
 */
const getItemsCount = (exports.getItemsCount = async projectId => {
  try {
    let res = await db.query(
      `select count(*) as count from  ${db.TABLES.Item} where project_id = $1`,
      [projectId]
    );
    return Number(res.rows[0].count);
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch project items');
  }
});

/**
 * Returns the criterion list associated with the project
 *
 * @param {Number} id - The project's ID
 * @return {Object}
 */
const getCriteria = (exports.getCriteria = async id => {
  try {
    let res = await db.query(
      `select * from ${db.TABLES.Criterion} where project_id = $1`,
      [id]
    );
    return res.rowCount > 0
      ? { rows: res.rows, meta: { count: res.rowCount } }
      : null;
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch records');
  }
});

/**
 * Returns the number of criteria associated with the project
 *
 * @param {Number} id - The project's ID
 * @return {Number}
 */
const getCriteriaCount = (exports.getCriteriaCount = async id => {
  try {
    let res = await db.query(
      `select count(*) from ${db.TABLES.Criterion} where project_id = $1`,
      [id]
    );
    return Number(res.rows[0].count);
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch records');
  }
});

/**
 * Returns the criteria for the given criterion ID list.
 *
 * @param {Number[]} criteria - Array of criterion IDs
 * @return {Object[]}
 */
const getCriteriaFromIds = (exports.getCriteriaFromIds = async criteria => {
  try {
    let res = await db.query(
      `select * from ${db.TABLES.Criterion} where id = ANY ($1)`,
      [criteria]
    );
    return res.rowCount > 0 ? res.rows : null;
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch records');
  }
});

/**
 * Returns the tests associated with the project
 *
 * @param {Number} id - The project's ID
 * @return {Object}
 */
const getTests = (exports.getTests = async id => {
  try {
    let res = await db.query(
      `select * from ${db.TABLES.Test} where project_id = $1`,
      [id]
    );
    return res.rowCount > 0
      ? { rows: res.rows, meta: { count: res.rowCount } }
      : null;
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch records');
  }
});

/**
 * Returns the number of tests associated with the project
 *
 * @param {Number} id - The project's ID
 * @return {Number}
 */
const getTestsCount = (exports.getTestsCount = async id => {
  try {
    let res = await db.query(
      `select count(*) from ${db.TABLES.Test} where project_id = $1`,
      [id]
    );
    return Number(res.rows[0].count);
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch records');
  }
});

/**
 * Deletes the project and its relationships only if there is no job pointing to it.
 *
 * @param {Number} id
 */
const safeDelete = (exports.safeDelete = async id => {
  try {
    let count = await getJobsCount(id);

    if (count > 0) {
      return;
    }
    await truncateProject(id);
    await db.query(`delete from ${db.TABLES.Project} where id = $1`, [id]);
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to remove the project');
  }
});

/**
 * Creates the items, filters and tests records for the given project.
 *
 * @param {Object} project
 * @param {Boolean} truncate - if true, remove all items, filters and tests associated with the project.
 */
const createRecordsFromCSVs = (exports.createRecordsFromCSVs = async (
  project,
  truncate = false
) => {
  try {
    if (truncate) {
      await truncateProject(project.id);
    }
    await createItems(project);
    await createTests(project);
    return true;
  } catch (error) {
    console.error(error);
  }
});

/**
 * Removes all the items, filters and tests records for the given project.
 *
 * @param {Number} id
 */
const truncateProject = async id => {
  try {
    console.debug(`Truncate project: ${id}`);
    await db.query('BEGIN');
    await db.query(`delete from ${db.TABLES.Item} where project_id = $1`, [id]);
    await db.query(`delete from ${db.TABLES.Criterion} where project_id = $1`, [
      id
    ]);
    await db.query(`delete from ${db.TABLES.Test} where project_id = $1`, [id]);
    await db.query('COMMIT');
  } catch (error) {
    await db.query('ROLLBACK');
    console.error(error);
    throw error;
  }
};

const createItems = async project => {
  try {
    console.log(`Creating items for project: ${project.id}`);
    let items = [];
    const transformer = item =>
      items.push({
        title: item.itemTitle,
        description: item.itemDescription
      });

    await new Promise((resolve, reject) => {
      request(project.data.itemsUrl)
        .on('error', err => reject(err))
        .pipe(csv())
        .on('data', transformer)
        .on('end', () => resolve())
        .on('error', err => reject(err));
    });
    await db.query('BEGIN');

    for (item of items) {
      await db.query(
        `insert into ${
          db.TABLES.Item
        }(created_at, project_id, data) values($1, $2, $3)`,
        [new Date(), project.id, item]
      );
    }

    await db.query(
      `update ${db.TABLES.Project} 
       set data = jsonb_set(data, '{itemsCreated}', 'true'::jsonb)
       where id = ${project.id}`
    );
    await db.query('COMMIT');
  } catch (error) {
    console.error(error);
    await db.query('ROLLBACK');
  }
};

const createTests = async project => {
  console.log(`Creating tests for project: ${project.id}`);
  try {
    let tests = [];
    const transformer = test => tests.push(test);

    await new Promise((resolve, reject) => {
      request(project.data.testsUrl)
        .on('error', err => reject(err))
        .pipe(csv())
        .on('data', transformer)
        .on('end', () => resolve())
        .on('error', err => reject(err));
    });

    let criteria = await getCriteria(project.id);
    let descriptionMap = {};

    for (c of criteria.rows) {
      descriptionMap[c.data.description.trim()] = c;
    }
    await db.query('BEGIN');

    for (test of tests) {
      let criterion = descriptionMap[test.filterDescription.trim()];

      if (!criterion) {
        // there are tests for other filters not present in the project's filters file.
        continue;
      }
      let data = {
        item: {
          title: test.itemTitle.trim(),
          description: test.itemDescription.trim()
        },
        criteria: [
          {
            id: criterion.id,
            label: criterion.data.label,
            description: test.filterDescription.trim(),
            answer: test.answer
          }
        ]
      };
      await db.query(
        `insert into ${
          db.TABLES.Test
        }(created_at, project_id, data) values($1, $2, $3)`,
        [new Date(), project.id, data]
      );
    }
    await db.query(
      `update ${db.TABLES.Project} 
       set data = jsonb_set(data, '{testsCreated}', 'true'::jsonb)
       where id = ${project.id}`
    );
    await db.query('COMMIT');
  } catch (error) {
    console.error(error);
    await db.query('ROLLBACK');
  }
};
