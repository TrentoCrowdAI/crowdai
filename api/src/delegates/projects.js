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
    let experiment = await new Promise((resolve, reject) => {
      bucket.get(`${DOCUMENTS.Experiment}${id}`, (err, data) => {
        if (err) {
          if (err.code === couchbase.errors.keyNotFound) {
            resolve(null);
          } else {
            reject(err);
          }
        } else {
          resolve(data.value);
        }
      });
    });
    experiment.consent = await new Promise((resolve, reject) => {
      request(experiment.consentUrl, (err, rsp, body) => {
        if (err) {
          reject(err);
        } else {
          resolve(rsp.body);
        }
      });
    });
    return experiment;
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

const createItems = async project => {
  let parser = parse({ delimiter: ',', columns: true });
  let items = [];
  const transformer = transform(item => items.push(item), { parallel: 10 });

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
  const transformer = transform(criterion => criteria.push(criterion), {
    parallel: 10
  });

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

  for (test of tests) {
    await db.query(
      `insert into ${
        db.TABLES.Test
      }(created_at, project_id, data) values($1, $2, $3)`,
      [new Date(), project.id, test]
    );
  }
};
