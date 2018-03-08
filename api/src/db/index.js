const { Pool } = require('pg');

const config = require(__base + 'config');

const pool = new Pool({
  database: config.db.database,
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password
});

const TABLES = Object.freeze({
  Requester: 'requester',
  Project: 'project',
  Experiment: 'experiment',
  Worker: 'worker',
  WorkerAssignment: 'worker_assignment',
  Item: 'item',
  Criterion: 'criterion',
  Test: 'test',
  Task: 'task',
  TestTask: 'test_task',
  TaskAnswer: 'task_answer'
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
