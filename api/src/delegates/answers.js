const couchbase = require('couchbase');
const Boom = require('boom');

const bucket = require(__base + 'db').bucket;
const config = require(__base + 'config/config.json');
const DOCUMENTS = require(__base + 'db').DOCUMENTS;

const create = (exports.create = async answer => {
  try {
    const key = `${DOCUMENTS.Answer}${answer.taskId}`;
    answer.type = 'answer';
    return await new Promise((resolve, reject) => {
      bucket.insert(key, answer, (error, result) => {
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
    throw Boom.badImplementation('Error while trying to persist answer');
  }
});

const getWorkerAnswers = (exports.getWorkerAnswers = async workerId => {
  try {
    const qs = `select * from \`${
      config.db.bucket
    }\` where type="answer" and workerId='${workerId}'`;
    const q = couchbase.N1qlQuery.fromString(qs);
    return await new Promise((resolve, reject) => {
      bucket.query(q, (err, answers) => {
        if (err) {
          reject(err);
        } else {
          resolve(answers);
        }
      });
    });
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation(
      "Error while trying to fetch worker's answers"
    );
  }
});

const getWorkerAnswersCount = (exports.getWorkerAnswersCount = async workerId => {
  try {
    const qs = `select count(*) as count from \`${
      config.db.bucket
    }\` where type="answer" and workerId='${workerId}'`;
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
    throw Boom.badImplementation(
      "Error while trying to fetch worker's answers"
    );
  }
});
