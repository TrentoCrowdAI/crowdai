/**
 * Loads tasks and filters to the database. Before running
 * this scripts, create the bucket using web interface.
 */

const csv = require('csvtojson');
const couchbase = require('couchbase');
const config = require('../config/config.json');

const ITEMS_FILE = __dirname + '/../data/items.csv';
const FILTERS_FILE = __dirname + '/../data/filters.csv';
const TESTS_FILE = __dirname + '/../data/tests.csv';

const cluster = new couchbase.Cluster(`couchbase://${config.db.host}`);
cluster.authenticate(config.db.user, config.db.password);
const bucket = cluster.openBucket(config.db.bucket);
const bucketManager = bucket.manager();

bucketManager.createPrimaryIndex({ name: 'crowdai-amt-pi' }, error => {
  if (error) {
    console.error('Error while creating primery index', error);
    process.exit(1);
  }
  // insert records in the database
  loadItems();
});

function loadItems() {
  console.log('loading items...');
  let items = [];
  csv()
    .fromFile(ITEMS_FILE)
    .on('json', item => items.push(item))
    .on('end', error => {
      if (error) {
        console.warn('Error while loading items: ', error);
        return;
      }
      loadFilters(items);
    });
}

function loadFilters(items) {
  console.log('loading filters...');
  let filters = [];
  csv()
    .fromFile(FILTERS_FILE)
    .on('json', filter => filters.push(filter))
    .on('end', error => {
      if (error) {
        console.warn('Error while loading filters: ', error);
        return;
      }
      loadTasks(generateTasks(items, filters));
    });
}

function loadTasks(tasks) {
  console.log('loading tasks...');

  for (let [idx, task] of tasks.entries()) {
    const key = `Task::${task.id}`;
    bucket.insert(key, task, (error, result) => {
      if (error) {
        console.error(`Error while inserting document ${key}. Error: ${error}`);
      } else {
        console.log(`${key} inserted correctly`);
      }

      if (idx === tasks.length - 1) {
        loadTests();
      }
    });
  }
}

function loadTests() {
  console.log('loading tests...');
  let tests = [];
  csv()
    .fromFile(TESTS_FILE)
    .on('json', test => tests.push({ ...test, type: 'testTask' }))
    .on('end', error => {
      if (error) {
        console.warn('Error while loading tests: ', error);
        return;
      }
      saveTests(tests);
    });
}

function saveTests(tests) {
  console.log('Saving tests to the DB');

  for (let [idx, test] of tests.entries()) {
    const key = `TestTask::${test.id}`;
    bucket.insert(key, test, (error, result) => {
      if (error) {
        console.error(`Error while inserting document ${key}. Error: ${error}`);
      } else {
        console.log(`${key} inserted correctly`);
      }

      if (idx === tests.length - 1) {
        console.log('Done');
        process.exit();
      }
    });
  }
}

const generateTasks = (items, filters) => {
  let tasks = [];
  let i = 0;

  for (filter of filters) {
    for (item of items) {
      tasks.push({
        id: ++i,
        filter,
        item,
        type: 'task'
      });
    }
  }
  return tasks;
};
