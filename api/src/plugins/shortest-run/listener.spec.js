const listener = require('./listener');
const db = require(__base + 'db');
const delegates = require(__base + 'delegates');
const { ShortestRunStates } = require('./manager');

describe('testing Shortest Run listener', async () => {
  let job;
  let handlerCalled = false;
  let originalOnJobCreatedListener = listener.onJobCreated;

  beforeAll(async () => {
    // we mock to avoid creating the records from the URLs.
    delegates.projects.createRecordsFromCSVs = jest.fn(() => {});
    listener.onJobCreated = jest.fn(() => (handlerCalled = true));

    let res = await db.query(
      `insert into ${
        db.TABLES.TaskAssignmentApi
      }(name, url, aggregation) values($1, $2, $3) returning *`,
      ['Shortest Run', 'http://url', true]
    );
    let taskAssignmentApi = res.rows[0];

    let requester = await delegates.requesters.create({});

    job = await delegates.jobs.create({
      requester_id: requester.id,
      data: {
        itemsUrl: 'http://items',
        testsUrl: 'http://tests',
        taskAssignmentStrategy: taskAssignmentApi.id,
        shortestRun: {
          baselineSize: 20
        }
      },
      criteria: [{ label: 'C1', description: 'a filter' }]
    });

    await originalOnJobCreatedListener(job);
  });

  test('the JOB_CREATED handler should initialize shortestRun property', async () => {
    expect(job).toBeDefined();
    expect(handlerCalled).toBe(true);
    expect(job.data.shortestRun).toBeDefined();
  });

  test('the JOB_CREATED handler should set shortestRun.state to INITIAL', async () => {
    expect(job.data.shortestRun.state).toBe(ShortestRunStates.INITIAL);
  });
});
