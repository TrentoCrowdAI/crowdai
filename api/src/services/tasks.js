const csv = require('csvtojson');

const ITEMS_FILE = __base + 'data/items.csv';
const FILTERS_FILE = __base + 'data/filters.csv';
let tasks = [];
let items = [];
let filters = [];

// for testing purposes, load data from a CSV file.
csv()
  .fromFile(ITEMS_FILE)
  .on('json', item => items.push(item))
  .on('end', error => {
    if (error) {
      console.warn('Error while loading items: ', error);
    }
  });

csv()
  .fromFile(FILTERS_FILE)
  .on('json', filter => filters.push(filter))
  .on('end', error => {
    if (error) {
      console.warn('Error while loading filters: ', error);
    }
  });

const generateTasks = () => {
  let tasks = [];
  let i = 0;

  for (filter of filters) {
    for (item of items) {
      tasks.push({
        id: ++i,
        filter,
        item
      });
    }
  }
  return tasks;
};

const get = async ctx => {
  if (tasks.length === 0) {
    tasks = generateTasks();
  }
  ctx.response.body = tasks;
};

const getNext = async ctx => {
  if (tasks.length === 0) {
    tasks = generateTasks();
  }
  ctx.response.body = tasks[Math.floor(Math.random() * tasks.length)];
};

exports.register = router => {
  router.get('/tasks', get);
  router.get('/tasks/next', getNext);
};
