const { Pool } = require('pg');
const promiseRetry = require('promise-retry');

const config = require(__base + 'config');

let credentials = {
  database: config.db.database,
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password
};

if (config.db.url) {
  // if a db URL is provided, we use it.
  credentials = {
    connectionString: config.db.url
  };
}

const pool = new Pool(credentials);

pool.on('error', (error, client) => {
  // we add this listener to avoid exiting the process.
  // see https://node-postgres.com/api/pool#-code-pool-on-39-error-39-err-error-client-client-gt-void-gt-void-code-
  console.debug('[pool.on.error]', error.message);
});

const TABLES = Object.freeze({
  Requester: 'requester',
  Project: 'project',
  Job: 'job',
  Worker: 'worker',
  WorkerAssignment: 'worker_assignment',
  Item: 'item',
  Criterion: 'criterion',
  Test: 'test',
  Task: 'task',
  TestTask: 'test_task',
  TaskAnswer: 'task_answer',
  TaskAssignmentApi: 'task_assignment_api',
  Result: 'result',
  AggregationApi: 'aggregation_api'
});

/**
 * Query wrapper to not use pg directly.
 *
 * @param {string} text
 * @param {any[]} params
 */
const query = (text, params) => {
  return promiseRetry({ retries: 15, randomize: true }, (retry, attempt) => {
    return pool.query(text, params).catch(err => {
      if (err.code === 'ECONNREFUSED') {
        console.log(`retrying query, attempt #${attempt}`);
        return retry(err);
      } else {
        return Promise.reject(err);
      }
    });
  });
};

/**
 * End pool wrapper.
 */
const end = () => pool.end();

module.exports = {
  TABLES,
  query,
  end
};
