const db = require(__base + 'db');
const jobsDelegate = require('./jobs');
const requestersDelegate = require('./requesters');
const projectsDelegate = require('./projects');
const { on } = require(__base + 'events/emitter');
const { EventTypes } = require(__base + 'events');
const testHelpers = require(__base + 'utils/test-helpers');

describe('jobs.create', async () => {
  let job;
  let eventEmitted = false;
  let requester;

  beforeAll(async () => {
    on(EventTypes.job.JOB_CREATED, job => (eventEmitted = true));
    // we mock to avoid creating the records from the URLs.
    projectsDelegate.createRecordsFromCSVs = jest.fn(() => {});
    requester = await requestersDelegate.create({});

    job = await jobsDelegate.create({
      requester_id: requester.id,
      data: {
        itemsUrl: 'http://items',
        testsUrl: 'http://tests'
      },
      criteria: [{ label: 'C1', description: 'a filter' }]
    });
  });

  test('should return the created job', async () => {
    expect(job).toBeDefined();
  });

  test('the created record should have an ID', async () => {
    expect(job.id).toBeDefined();
  });

  test('should emit JOB_CREATED event', async () => {
    expect(eventEmitted).toBe(true);
  });

  test('Researcher mode should not set taskAssignmentStrategy automatically', () => {
    expect(job.data.shortestRun).not.toBeDefined();
    expect(job.data.taskAssignmentStrategy).not.toBeDefined();
  });

  test('Author mode should set taskAssignmentStrategy automatically', async () => {
    let taskAssignmentApi = await testHelpers.createFakeTaskAssignmentApi(
      'Shortest Run',
      'http://127.0.0.1:5000/msr',
      true
    );
    job = await jobsDelegate.create(
      {
        requester_id: requester.id,
        data: {
          itemsUrl: 'http://items',
          testsUrl: 'http://tests'
        },
        criteria: [{ label: 'C1', description: 'a filter' }]
      },
      true
    );

    expect(job.data.shortestRun).toBeDefined();
    expect(job.data.shortestRun.baselineSize).toBe(20);
    expect(job.data.taskAssignmentStrategy).toBe(taskAssignmentApi.id);
  });
});
