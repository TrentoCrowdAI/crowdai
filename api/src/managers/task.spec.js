const uuid = require('uuid/v4');

const taskManager = require('./task');
const db = require(__base + 'db');
const testHelpers = require(__base + 'utils/test-helpers');
const delegates = require(__base + 'delegates');

test('should define getPendingVotes', () => {
  expect(taskManager.getPendingVotes).toBeDefined();
});

test('should define generateTasks', () => {
  expect(taskManager.generateTasks).toBeDefined();
});

test('should define getTasksFromApi', () => {
  expect(taskManager.getTasksFromApi).toBeDefined();
});

test('should define getState', () => {
  expect(taskManager.getState).toBeDefined();
});

test('should define getEstimatedTasksPerWorkerCount', () => {
  expect(taskManager.getEstimatedTasksPerWorkerCount).toBeDefined();
});

test('should define getEstimatedWorkersCount', () => {
  expect(taskManager.getEstimatedWorkersCount).toBeDefined();
});

let setups = [
  {
    name: 'one',
    pendings: [
      { item: 1, filter: 1, pending: 1 },
      { item: 2, filter: 1, pending: 2 },
      { item: 3, filter: 2, pending: 2 }
    ],
    job: { data: { maxTasksRule: 3 } },
    output: 4
  },
  {
    name: 'two',
    pendings: [
      { item: 1, filter: 1, pending: 2 },
      { item: 2, filter: 1, pending: 2 },
      { item: 3, filter: 2, pending: 2 },
      { item: 4, filter: 2, pending: 3 }
    ],
    job: { data: { maxTasksRule: 1 } },
    output: 9
  }
];

describe('getEstimatedWorkersCount', () => {
  for (let s of setups) {
    test(`should return ${s.output} for setup ${s.name}`, async () => {
      const count = await taskManager.getEstimatedWorkersCount(
        s.job,
        s.pendings
      );
      expect(count).toBe(s.output);
    });
  }
});

describe('getPendingVotes', () => {
  test('should return pending votes summary', async () => {
    const itemsCount = 4;
    const filtersCount = 2;
    let job = await testHelpers.createJob(itemsCount, filtersCount, {
      maxTasksRule: 3
    });
    const filters = await delegates.projects.getCriteria(job.project_id);
    const items = await db.query(
      `select id from ${db.TABLES.Item} where project_id = $1`,
      [job.project_id]
    );
    let worker = await delegates.workers.create(uuid());

    for (let filter of filters.rows) {
      for (let item of items.rows) {
        for (let i = 0; i < job.data.maxTasksRule; i++) {
          let data = {
            criteria: [{ id: `${filter.id}` }],
            answered: false
          };
          await db.query(
            `insert into ${
              db.TABLES.Task
            }(job_id, item_id, worker_id, created_at, deleted_at, data) values($1, $2, $3, $4, $5, $6)`,
            [job.id, item.id, worker.id, new Date(), new Date(), data]
          );
        }
      }
    }

    let pendings = await taskManager.getPendingVotes(job);
    expect(pendings).toBeDefined();
    expect(pendings.length).toBe(8);
  });
});
