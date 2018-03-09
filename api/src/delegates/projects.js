const Boom = require('boom');
const couchbase = require('couchbase');
const uuid = require('uuid/v4');
const request = require('request');
const parse = require('csv-parse');
const transform = require('stream-transform');

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
    let res = await db.query(
      `insert into ${
        db.TABLES.Project
      }(requester_id, created_at, data) values($1, $2, $3) returning *`,
      [project.requester_id, new Date(), project.data]
    );
    //await createTasks(item);
    //return cas;
    return res.rows[0];
  } catch (error) {
    console.error(error);
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

const createTasks = async experiment => {
  let parser = parse({ delimiter: ',', columns: true });
  // first we read the filters
  let filters = [];
  const filtersTransformer = transform(record => filters.push(record), {
    parallel: 10
  });

  try {
    request(experiment.filtersUrl)
      .pipe(parser)
      .pipe(filtersTransformer);

    await new Promise((resolve, reject) => {
      filtersTransformer.on('finish', () => {
        resolve();
      });

      filtersTransformer.on('error', err => {
        reject(err);
      });
    });
    // insert tasks into the database.
    const itemsTransformer = transform(
      async item => {
        for (filter of filters) {
          await tasksDelegate.createTask({
            id: uuid(),
            filter,
            item,
            experimentId: experiment.id
          });
        }
      },
      { parallel: 10 }
    );
    let itemsParser = parse({ delimiter: ',', columns: true });
    request(experiment.itemsUrl)
      .pipe(itemsParser)
      .pipe(itemsTransformer);

    await new Promise((resolve, reject) => {
      itemsTransformer.on('finish', () => {
        resolve();
      });

      itemsTransformer.on('error', err => {
        reject(err);
      });
    });

    // insert test task into the database
    const testsTransformer = transform(
      async testTask => {
        await tasksDelegate.createTask(
          {
            ...testTask,
            id: uuid(),
            experimentId: experiment.id
          },
          true
        );
      },
      { parallel: 10 }
    );
    let testsParser = parse({ delimiter: ',', columns: true });
    request(experiment.testsUrl)
      .pipe(testsParser)
      .pipe(testsTransformer);

    await new Promise((resolve, reject) => {
      testsTransformer.on('finish', () => {
        resolve();
      });

      testsTransformer.on('error', err => {
        reject(err);
      });
    });
  } catch (error) {
    console.error(error);
  }
};