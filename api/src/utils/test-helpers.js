const delegates = require(__base + 'delegates');
const db = require(__base + 'db');

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
 * Helper method that creates a job in the db.
 *
 * @param {Object} extraDataAttrs Additional data attributes
 * @return {Object} The job created.
 */
exports.createFakeJob = async (extraDataAttrs = {}) => {
  // we mock to avoid creating the records from the URLs.
  delegates.projects.createRecordsFromCSVs = jest.fn(() => {});
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
