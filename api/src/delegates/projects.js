const Boom = require('boom');
const couchbase = require('couchbase');
const uuid = require('uuid/v4');
const request = require('request');
const parse = require('csv-parse');
const transform = require('stream-transform');
const QueryStream = require('pg-query-stream');

const db = require(__base + 'db');
const config = require(__base + 'config');
const tasksDelegate = require('./tasks');
const requestersDelegate = require('./requesters');

const getByRequester = (exports.getByRequester = async id => {
  try {
    let res = await db.query(`select * from ${db.TABLES.Project}`);
    return { rows: res.rows, meta: { count: res.rowCount } };
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch records');
  }
});

const getById = (exports.getById = async id => {
  try {
    let res = await db.query(
      `select * from ${db.TABLES.Project} where id = $1`,
      [id]
    );
    const project = res.rows[0];
    project.consent = await new Promise((resolve, reject) => {
      request(project.data.consentUrl, (err, rsp, body) => {
        if (err) {
          reject(err);
        } else {
          resolve(rsp.body);
        }
      });
    });
    return project;
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch the record');
  }
});

const create = (exports.create = async project => {
  if (!project) {
    throw Boom.badRequest('Project attributes are required');
  }

  try {
    await db.query('BEGIN');
    let res = await db.query(
      `insert into ${
        db.TABLES.Project
      }(requester_id, created_at, data) values($1, $2, $3) returning *`,
      [project.requester_id, new Date(), project.data]
    );
    const saved = res.rows[0];
    await createItems(saved);
    await createCriteria(saved);
    await createTests(saved);
    await db.query('COMMIT');
    return saved;
  } catch (error) {
    console.error(error);
    await db.query('ROLLBACK');
    throw Boom.badImplementation('Error while trying to persist the record');
  }
});

const update = (exports.update = async (id, item) => {
  try {
    let saved = await getById(id);
    let payload = {
      ...saved,
      ...item
    };
    const key = `${DOCUMENTS.Experiment}${item.id}`;
    return await new Promise((resolve, reject) => {
      bucket.upsert(key, payload, (error, result) => {
        if (error) {
          console.error(
            `Error while inserting document ${key}. Error: ${error}`
          );
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to update the record');
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
 * Returns the criterion list associated with the project
 *
 * @param {Number} id - The project's ID
 * @return {Object[]}
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
 * Returns the criteria for the given criterion ID list.
 *
 * @param {Number[]} criteria - Array of criterion IDs
 * @return {Object[]}
 */
const getCriteriaFromIds = (exports.getCriteriaFromIds = async criteria => {
  try {
    let res = await db.query(
      `select * from ${db.TABLES.Criterion} where id in $1`,
      [criteria]
    );
    return res.rowCount > 0
      ? { rows: res.rows, meta: { count: res.rowCount } }
      : null;
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch records');
  }
});

const createItems = async project => {
  let parser = parse({ delimiter: ',', columns: true });
  let items = [];
  const transformer = transform(
    item =>
      items.push({
        item: { title: item.itemTitle, description: item.itemDescription }
      }),
    { parallel: 10 }
  );

  request(project.data.itemsUrl)
    .pipe(parser)
    .pipe(transformer);

  await new Promise((resolve, reject) => {
    transformer.on('finish', () => {
      resolve();
    });

    transformer.on('error', err => {
      reject(err);
    });
  });

  for (item of items) {
    await db.query(
      `insert into ${
        db.TABLES.Item
      }(created_at, project_id, data) values($1, $2, $3)`,
      [new Date(), project.id, item]
    );
  }
};

const createCriteria = async project => {
  let parser = parse({ delimiter: ',', columns: true });
  let criteria = [];
  let labelCount = 1;

  const transformer = transform(
    criterion =>
      criteria.push({
        label: `C${labelCount++}`,
        description: criterion.filterDescription
      }),
    {
      parallel: 10
    }
  );

  request(project.data.filtersUrl)
    .pipe(parser)
    .pipe(transformer);

  await new Promise((resolve, reject) => {
    transformer.on('finish', () => {
      resolve();
    });

    transformer.on('error', err => {
      reject(err);
    });
  });

  for (criterion of criteria) {
    await db.query(
      `insert into ${
        db.TABLES.Criterion
      }(created_at, project_id, data) values($1, $2, $3)`,
      [new Date(), project.id, criterion]
    );
  }
};

const createTests = async project => {
  let parser = parse({ delimiter: ',', columns: true });
  let tests = [];
  const transformer = transform(test => tests.push(test), {
    parallel: 10
  });

  request(project.data.testsUrl)
    .pipe(parser)
    .pipe(transformer);

  await new Promise((resolve, reject) => {
    transformer.on('finish', () => {
      resolve();
    });

    transformer.on('error', err => {
      reject(err);
    });
  });

  let criteria = await getCriteria(project.id);
  let descriptionMap = {};

  for (c of criteria.rows) {
    descriptionMap[c.data.description.trim()] = c;
  }

  for (test of tests) {
    let criterion = descriptionMap[test.filterDescription.trim()];
    let data = {
      item: { title: test.itemTitle, description: test.itemDescription },
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
};
