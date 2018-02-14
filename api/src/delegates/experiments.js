const Boom = require('boom');
const couchbase = require('couchbase');
const uuid = require('uuid/v4');
const request = require('request');
const parse = require('csv-parse');
const transform = require('stream-transform');

const bucket = require(__base + 'db').bucket;
const config = require(__base + 'config');
const { DOCUMENTS, TYPES } = require(__base + 'db');
const tasksDelegate = require('./tasks');

const getByRequester = (exports.getByRequester = async requesterId => {
  try {
    const qs = `select * from \`${config.db.bucket}\` where type="${
      TYPES.experiment
    }" and requesterId='${requesterId}'`;
    const q = couchbase.N1qlQuery.fromString(qs);
    return await new Promise((resolve, reject) => {
      bucket.query(q, (err, answers) => {
        if (err) {
          reject(err);
        } else {
          resolve(answers.map(a => a[config.db.bucket]));
        }
      });
    });
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch records');
  }
});

const getByRequesterCount = (exports.getByRequesterCount = async workerId => {
  try {
    const qs = `select count(*) as count from \`${
      config.db.bucket
    }\` where type="${TYPES.experiment}" and requesterId='${requesterId}'`;
    const q = couchbase.N1qlQuery.fromString(qs);
    q.consistency(couchbase.N1qlQuery.Consistency.STATEMENT_PLUS);
    return await new Promise((resolve, reject) => {
      bucket.query(q, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data[0].count);
        }
      });
    });
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch records count');
  }
});

const getById = (exports.getById = async id => {
  try {
    return await new Promise((resolve, reject) => {
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
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch the record');
  }
});

const create = (exports.create = async item => {
  try {
    item.id = uuid();
    const key = `${DOCUMENTS.Experiment}${item.id}`;
    item = {
      ...item,
      maxTasksRule: Number(item.maxTasksRule),
      taskRewardRule: Number(item.taskRewardRule),
      testFrequencyRule: Number(item.testFrequencyRule),
      initialTestsRule: Number(item.initialTestsRule),
      initialTestsMinCorrectAnswersRule: Number(
        item.initialTestsMinCorrectAnswersRule
      ),
      votesPerTaskRule: Number(item.votesPerTaskRule),
      type: TYPES.experiment
    };

    let cas = await new Promise((resolve, reject) => {
      bucket.insert(key, item, (error, result) => {
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
    await createTasks(item);
    return cas;
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
