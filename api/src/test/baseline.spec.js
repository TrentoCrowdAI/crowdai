const uuid = require('uuid/v4');
const request = require('supertest');
jest.unmock('request');

const app = require(__base + 'app');
const testHelpers = require(__base + 'utils/test-helpers');
const db = require(__base + 'db');
const workersApi = '/workers/api/v1';

describe('GET /jobs/:uuid/tasks/next', () => {
  let job;
  let setup = {
    itemsCount: 3,
    filtersCount: 1,
    job: {
      votesPerTaskRule: 3,
      maxTasksRule: 3,
      initialTestsRule: 3,
      testFrequencyRule: 2,
      taskRewardRule: 0.2,
      hitConfig: {}
    }
  };

  beforeAll(async () => {
    let taskAssignmentApi = await testHelpers.createBaselineTaskAssignmentApi();
    job = await testHelpers.createJob(setup.itemsCount, setup.filtersCount, {
      ...setup.job,
      taskAssignmentStrategy: taskAssignmentApi.id
    });
  });

  test('For a new worker the service should return a quiz task', async () => {
    const response = await request(app.callback())
      .get(`${workersApi}/jobs/${job.uuid}/tasks/next`)
      .query({
        workerId: uuid(),
        assignmentId: uuid()
      });
    expect(response.status).toBe(200);
    expect(response.body.type).toBeDefined();
    expect(response.body.data.initial).toBe(true);
  });

  test('workerSolvedMinTasks boolean flag should be present in the response if the service fails', async () => {
    let api = await testHelpers.createFakeTaskAssignmentApi(
      'Baseline down',
      'http://127.0.0.1:3434',
      false
    );
    let jobTwo = await testHelpers.createJob(
      setup.itemsCount,
      setup.filtersCount,
      {
        ...setup.job,
        taskAssignmentStrategy: api.id
      }
    );
    const response = await request(app.callback())
      .get(`${workersApi}/jobs/${jobTwo.uuid}/tasks/next`)
      .query({
        workerId: uuid(),
        assignmentId: uuid()
      });
    expect(response.status).toBe(500);
    expect(response.body.payload).toBeDefined();
    expect(response.body.payload.workerSolvedMinTasks).toBeDefined();
    expect(response.body.payload.workerSolvedMinTasks).toBe(false);
  });
});
