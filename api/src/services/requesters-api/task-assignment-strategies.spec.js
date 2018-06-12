const request = require('supertest');

const app = require(__base + 'app');
const testHelpers = require(__base + 'utils/test-helpers');
const delegates = require(__base + 'delegates');
const db = require(__base + 'db');

describe('/task-assignment-strategies services', () => {
  test('GET /task-assignment-strategies should return task_assignment_api records', async () => {
    let requester = await delegates.requesters.create({});
    let taskAssignmentApi = await testHelpers.createFakeTaskAssignmentApi(
      'Shortest Run',
      'http://127.0.0.1:5000/msr',
      true
    );
    // we mock state object so that getAll can retrieve the "current" requester.
    Object.defineProperty(app.context, 'state', {
      get: () => ({ loginInfo: {} }),
      set: newValue => {}
    });
    delegates.requesters.getRequesterByGid = jest.fn(() => requester);
    const response = await request(app.callback()).get(
      '/requesters/api/v1/task-assignment-strategies'
    );
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.length).toBeDefined();
  });
});
