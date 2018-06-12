const uuid = require('uuid/v4');

const delegates = require(__base + 'delegates');
const taskManager = require(__base + 'managers/task');
const db = require(__base + 'db');

// we mock to avoid creating the records from the URLs.
if (process.env.NODE_ENV === 'test') {
  delegates.projects.createRecordsFromCSVs = jest.fn(() => {});
}

/**
 * Helper method that adds a task assigment api record to the DB.
 *
 * @param {String} name
 * @param {String} url
 * @param {Boolean} aggregation
 */
exports.createFakeTaskAssignmentApi = async (
  name = 'fake task assignment',
  url = 'http://url',
  aggregation = false
) => {
  let record = await db.query(
    `insert into ${
      db.TABLES.TaskAssignmentApi
    }(name, url, aggregation) values($1, $2, $3) returning *`,
    [name, url, aggregation]
  );
  return record.rows[0];
};

/**
 * Helper method that creates an empty job in the db.
 *
 * @param {Object} extraDataAttrs Additional data attributes
 * @return {Object} The job created.
 */
exports.createFakeJob = async (extraDataAttrs = {}) => {
  let requester = await delegates.requesters.create({});

  job = await delegates.jobs.create({
    requester_id: requester.id,
    data: {
      itemsUrl: 'http://items',
      testsUrl: 'http://tests',
      ...extraDataAttrs
    },
    criteria: [{ label: 'C1', description: 'a filter' }]
  });

  return job;
};

/**
 * Creates a job with items and filters.
 *
 * @param {Number} itemsCount Number of items to insert into the item table
 * @param {Number} filtersCount Number of filters to insert into the criterion table
 * @param {Object} attrs Additional data attributes.
 */
exports.createJob = async (itemsCount, filtersCount, attrs = {}) => {
  await db.query('BEGIN');
  let requester = await delegates.requesters.create({});
  let filters = [];

  for (let i = 0; i < filtersCount; i++) {
    filters.push({ label: `C${i + 1}`, description: `filter number ${i + 1}` });
  }

  job = await delegates.jobs.create({
    requester_id: requester.id,
    data: {
      itemsUrl: 'http://items',
      testsUrl: 'http://tests',
      ...attrs
    },
    criteria: filters
  });

  // we create the fake items
  for (let i = 0; i < itemsCount; i++) {
    await db.query(
      `insert into ${
        db.TABLES.Item
      }(created_at, project_id, data) values($1, $2, $3)`,
      [
        new Date(),
        job.project_id,
        {
          title: `Paper.title number ${i + 1}`,
          description: `Paper.description number ${i + 1}`
        }
      ]
    );
  }
  await db.query('COMMIT');
  return job;
};

/**
 * Simulates voting for the given job. It assumes items and filters
 * have been created already. Votes are random.
 *
 * @param {Object} job
 */
exports.simulateVoting = async job => {
  let response = { done: false };

  while (!response.done) {
    let worker = await delegates.workers.create(uuid());
    await delegates.workers.createAssignment({
      job_id: job.id,
      job_uuid: job.uuid,
      worker_id: worker.id,
      data: {
        assignmentTurkId: uuid()
      }
    });
    let response = await taskManager.getTasksFromApi(job, worker);

    if (response.done) {
      break;
    }
    let filter = response.criteria[0];
    let items = response.items;

    for (let i = 0; i < items.length; i++) {
      await delegates.tasks.createTask({
        end: new Date(),
        job_id: job.id,
        worker_id: worker.id,
        item_id: items[i],
        data: {
          criteria: [
            {
              id: `${filter}`,
              workerAnswer: Math.random() > 0.5 ? 'yes' : 'no'
            }
          ],
          answered: true
        }
      });
    }
  }
};
