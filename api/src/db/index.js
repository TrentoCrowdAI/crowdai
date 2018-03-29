const { Pool } = require('pg');

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
  TaskAssignmentApi: 'task_assignment_api'
});

/**
 * Query wrapper to not use pg directly.
 *
 * @param {string} text
 * @param {any[]} params
 */
const query = (text, params) => pool.query(text, params);

module.exports = {
  TABLES,
  query
};
