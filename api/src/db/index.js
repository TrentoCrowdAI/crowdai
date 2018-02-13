const couchbase = require('couchbase');
const config = require(__base + 'config');

const cluster = new couchbase.Cluster(`couchbase://${config.db.host}`);
cluster.authenticate(config.db.user, config.db.password);
const bucket = cluster.openBucket(config.db.bucket);

const DOCUMENTS = {
  Task: 'Task::',
  Answer: 'Answer::',
  WorkerAssignment: 'WorkerAssignment::',
  TestTask: 'TestTask::',
  TestAnswer: 'TestAnswer::',
  Requester: 'Requester::'
};

const TYPES = {
  task: 'task',
  answer: 'answer',
  assignment: 'assignment',
  testTask: 'testTask',
  testAnswer: 'testAnswer',
  requester: 'requester'
};

module.exports = {
  DOCUMENTS,
  TYPES,
  bucket
};
