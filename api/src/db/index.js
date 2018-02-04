const couchbase = require('couchbase');
const config = require('../config/config.json');

const cluster = new couchbase.Cluster(`couchbase://${config.db.host}`);

const documents = {
  Task: 'Task::'
};

module.exports = {
  documents
};
