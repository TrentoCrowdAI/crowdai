const request = require('supertest');

const app = require(__base + 'app');
const testHelpers = require(__base + 'utils/test-helpers');
const delegates = require(__base + 'delegates');

describe('/aggregation-strategies services', () => {
  test('GET /aggregation-strategies should return aggregation_api records', async () => {
    let requester = await delegates.requesters.create({});
    let aggregationApi = await testHelpers.createFakeAggregationApi(
      'Majority Voting',
      'http://127.0.0.1:10000/mv',
      true
    );
    // we mock state object so that getAll can retrieve the "current" requester.
    Object.defineProperty(app.context, 'state', {
      get: () => ({ loginInfo: {} }),
      set: newValue => {}
    });
    delegates.requesters.getRequesterByGid = jest.fn(() => requester);
    const response = await request(app.callback()).get(
      '/requesters/api/v1/aggregation-strategies'
    );
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.length).toBeDefined();
  });
});
