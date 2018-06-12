const request = require('supertest');
jest.unmock('request');
jest.mock(__base + 'utils/mturk');

const app = require(__base + 'app');
const testHelpers = require(__base + 'utils/test-helpers');
const { ShortestRunStates } = require(__base + 'plugins/shortest-run/manager');
const { JobStatus } = require(__base + 'utils/constants');
const listener = require(__base + 'plugins/shortest-run/listener');
const db = require(__base + 'db');

const requesterApi = '/requesters/api/v1';

describe('Shortest Run workflow', () => {
  let setup = {
    itemsCount: 30,
    filtersCount: 2,
    job: {
      votesPerTaskRule: 3,
      maxTasksRule: 3,
      initialTestsRule: 3,
      testFrequencyRule: 2,
      taskRewardRule: 0.2,
      hitConfig: {}
    },
    cost: '56.40'
  };
  let job;

  beforeAll(async () => {
    let taskAssignmentApi = await testHelpers.createFakeTaskAssignmentApi(
      'Shortest Run',
      'http://127.0.0.1:5000/msr',
      true
    );
    job = await testHelpers.createJob(setup.itemsCount, setup.filtersCount, {
      ...setup.job,
      taskAssignmentStrategy: taskAssignmentApi.id
    });
  });

  test(`GET ${requesterApi}/jobs/:id/state returns ${
    ShortestRunStates.INITIAL
  }`, async () => {
    const response = await request(app.callback()).get(
      `${requesterApi}/jobs/${job.id}/state`
    );
    expect(response.status).toBe(200);
    expect(response.body.taskAssignmentApi).toBe(ShortestRunStates.INITIAL);
  });

  test('Initialize baseline round', async () => {
    const response = await request(app.callback())
      .post(`${requesterApi}/shortest-run/generate-baseline`)
      .send({ jobId: job.id, size: 20 });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('generated');
  });

  test('GET /jobs/:id should include estimated cost', async () => {
    const response = await request(app.callback()).get(
      `${requesterApi}/jobs/${job.id}`
    );
    expect(response.status).toBe(200);
    expect(response.body.estimatedCost).toBeDefined();
    expect(response.body.estimatedCost.total.toFixed(2)).toBe(setup.cost);
    job = response.body;
  });

  test('Publish baseline (step #0) to AMT should set job.data.status to PUBLISHED', async () => {
    const delegates = require(__base + 'delegates');
    const jobsEvent = require(__base + 'events/jobs');
    delegates.jobs.getInstructions = jest.fn(() => ({}));
    jobsEvent.onStartCronForHit = jest.fn();
    const response = await request(app.callback()).post(
      `${requesterApi}/jobs/${job.id}/publish`
    );
    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.status).toBe(JobStatus.PUBLISHED);
    job = response.body;
  });

  test('listener.onJobReviewDone should call POST /estimate-task-parameters after baseline round finishes', async () => {
    jest.setTimeout(30000);
    await testHelpers.simulateVoting(job);
    job = await listener.onJobReviewDone(job);
    expect(job).toBeDefined();
    expect(job.data.shortestRun.parametersEstimation).toBeDefined();
    expect(job.data.shortestRun.state).toBe(ShortestRunStates.ASSIGN_FILTERS);
  });

  test('Call POST /shortest-run/assign-filters should set state to FILTERS_ASSIGNED and create entries in backlog', async () => {
    const response = await request(app.callback())
      .post(`${requesterApi}/shortest-run/assign-filters`)
      .send({ jobId: job.id });
    expect(response.status).toBe(200);
    expect(response.body.data.shortestRun.state).toBe(
      ShortestRunStates.FILTERS_ASSIGNED
    );
    let rsp = await db.query(
      'select max(step) as step from backlog where job_id = $1',
      [job.id]
    );
    let currentStep = rsp.rows[0].step;
    expect(currentStep).toBe(1);
    job = response.body;
  });

  test('Publish step #1 to AMT. This step should create a new HIT', async () => {
    expect(job.data.status).toBe(JobStatus.NOT_PUBLISHED);
    expect(job.data.end).toBeUndefined();
    expect(job.data.hit).toBeUndefined();
    expect(job.data.shortestRun.hits).toBeDefined();
    expect(job.data.shortestRun.hits.length).toBe(1);

    const delegates = require(__base + 'delegates');
    const jobsEvent = require(__base + 'events/jobs');
    delegates.jobs.getInstructions = jest.fn(() => ({}));
    jobsEvent.onStartCronForHit = jest.fn();
    const response = await request(app.callback()).post(
      `${requesterApi}/jobs/${job.id}/publish`
    );
    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.status).toBe(JobStatus.PUBLISHED);
    expect(response.body.data.hit).toBeDefined();
    job = response.body;
  });

  test('Shortest Run finishes and store results in the result table', async () => {
    jest.setTimeout(30000);
    const delegates = require(__base + 'delegates');
    const jobsEvent = require(__base + 'events/jobs');
    delegates.jobs.getInstructions = jest.fn(() => ({}));
    jobsEvent.onStartCronForHit = jest.fn();

    while (true) {
      await testHelpers.simulateVoting(job);
      job = await listener.onJobReviewDone(job);

      if (job.data.shortestRun.state === ShortestRunStates.DONE) {
        break;
      }
      expect(job.data.shortestRun.state).toBe(ShortestRunStates.UPDATED);

      let response = await request(app.callback())
        .post(`${requesterApi}/shortest-run/assign-filters`)
        .send({ jobId: job.id });
      expect(response.status).toBe(200);
      expect(response.body.data.shortestRun.state).toBe(
        ShortestRunStates.FILTERS_ASSIGNED
      );

      response = await request(app.callback()).post(
        `${requesterApi}/jobs/${job.id}/publish`
      );
      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.status).toBe(JobStatus.PUBLISHED);
      expect(response.body.data.hit).toBeDefined();
      job = response.body;
    }
    expect(job.data.shortestRun.state).toBe(ShortestRunStates.DONE);
    const count = await delegates.jobs.getClassifiedItemsCount(job.id);
    expect(count).toBe(setup.itemsCount);
  });
});
