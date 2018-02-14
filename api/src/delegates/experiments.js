const Boom = require('boom');
const couchbase = require('couchbase');
const uuid = require('uuid/v4');

const bucket = require(__base + 'db').bucket;
const config = require(__base + 'config');
const { DOCUMENTS, TYPES } = require(__base + 'db');

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
    item.type = TYPES.experiment;
    return await new Promise((resolve, reject) => {
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
