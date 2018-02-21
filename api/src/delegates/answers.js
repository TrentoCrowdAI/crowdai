const couchbase = require('couchbase');
const Boom = require('boom');

const bucket = require(__base + 'db').bucket;
const config = require(__base + 'config');
const { DOCUMENTS, TYPES } = require(__base + 'db');

const TestAnswerStrategy = (exports.TestAnswerStrategy = Object.freeze({
  ALL: 'ALL',
  INITIAL: 'INITIAL',
  HONEYPOT: 'HONEYPOT'
}));

const create = (exports.create = async answer => {
  try {
    if (!answer.experimentId) {
      throw Boom.badRequest('Answer must have experimentId');
    }
    let key;
    let payload = { ...answer };
    delete payload.task;

    if (answer.task.type === TYPES.task) {
      key = `${DOCUMENTS.Answer}${answer.experimentId}::${answer.task.id}`;
      payload.taskId = answer.task.id;
      payload.type = TYPES.answer;
    } else if (answer.task.type === TYPES.testTask) {
      key = `${DOCUMENTS.TestAnswer}${answer.experimentId}::${answer.task.id}`;
      payload.testTaskId = answer.task.id;
      payload.type = TYPES.testAnswer;
    }
    return await new Promise((resolve, reject) => {
      bucket.insert(key, payload, (error, result) => {
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

const getOne = (exports.getOne = async (experimentId, taskId, taskType) => {
  try {
    let key;

    if (taskType === TYPES.task) {
      key = `${DOCUMENTS.Answer}${experimentId}::${taskId}`;
    } else if (taskType === TYPES.testTask) {
      key = `${DOCUMENTS.TestAnswer}${experimentId}::${taskId}`;
    }

    return await new Promise((resolve, reject) => {
      bucket.get(key, (err, data) => {
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
    throw Boom.badImplementation('Error while trying to fetch answer');
  }
});

const update = (exports.update = async answer => {
  try {
    if (!answer.experimentId) {
      throw Boom.badRequest('Answer must have experimentId');
    }
    let answerFromDB = await getOne(
      answer.experimentId,
      answer.task.id,
      answer.task.type
    );
    let payload = { ...answerFromDB, ...answer };
    delete payload.task;
    let key;

    if (answer.task.type === TYPES.task) {
      key = `${DOCUMENTS.Answer}${answer.experimentId}::${answer.task.id}`;
    } else if (answer.task.type === TYPES.testTask) {
      key = `${DOCUMENTS.TestAnswer}${answer.experimentId}::${answer.task.id}`;
    }
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
    throw Boom.badImplementation('Error while trying to update answer');
  }
});

const getWorkerAnswers = (exports.getWorkerAnswers = async (
  experimentId,
  workerId
) => {
  try {
    const qs = `select * from \`${config.db.bucket}\` where type="${
      TYPES.answer
    }" and workerId='${workerId}' and experimentId="${experimentId}"`;
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

const getWorkerAnswersCount = (exports.getWorkerAnswersCount = async (
  experimentId,
  workerId
) => {
  try {
    const qs = `select count(*) as count from \`${
      config.db.bucket
    }\` where type="${
      TYPES.answer
    }" and workerId='${workerId}' and experimentId="${experimentId}"`;
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

const getWorkerTestAnswers = (exports.getWorkerTestAnswers = async (
  experimentId,
  workerId,
  strategy = TestAnswerStrategy.ALL
) => {
  try {
    let qs;
    const baseSql = `select * from \`${config.db.bucket}\` where type="${
      TYPES.testAnswer
    }" and workerId='${workerId}' and experimentId="${experimentId}"`;

    if (strategy === TestAnswerStrategy.INITIAL) {
      qs = `${baseSql} and initial=true`;
    } else if (strategy === TestAnswerStrategy.HONEYPOT) {
      qs = `${baseSql} and initial=false`;
    } else if (strategy === TestAnswerStrategy.ALL) {
      qs = baseSql;
    } else {
      throw Boom.badRequest('Strategy not supported');
    }
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
      "Error while trying to fetch worker's test answers"
    );
  }
});

const getWorkerTestAnswersCount = (exports.getWorkerTestAnswersCount = async (
  experimentId,
  workerId,
  strategy = TestAnswerStrategy.ALL
) => {
  try {
    let qs;
    const baseSql = `select count(*) as count from \`${
      config.db.bucket
    }\` where type="${
      TYPES.testAnswer
    }" and workerId='${workerId}' and experimentId="${experimentId}"`;

    if (strategy === TestAnswerStrategy.INITIAL) {
      qs = `${baseSql} and initial=true`;
    } else if (strategy === TestAnswerStrategy.HONEYPOT) {
      qs = `${baseSql} and initial=false`;
    } else if (strategy === TestAnswerStrategy.ALL) {
      qs = baseSql;
    } else {
      throw Boom.badRequest('Strategy not supported');
    }
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
      "Error while trying to fetch worker's test answers count"
    );
  }
});
