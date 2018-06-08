const db = require(__base + 'db');
const jobsDelegate = require('./jobs');
const requestersDelegate = require('./requesters');
const projectsDelegate = require('./projects');
const { on } = require(__base + 'events/emitter');
const { EventTypes } = require(__base + 'events');

describe('jobs.create', async () => {
  let job;
  let eventEmitted = false;

  beforeAll(async () => {
    on(EventTypes.job.JOB_CREATED, job => (eventEmitted = true));
    // we mock to avoid creating the records from the URLs.
    projectsDelegate.createRecordsFromCSVs = jest.fn(() => {});
    let requester = await requestersDelegate.create({});

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
});
