const aggregationApi = require('./aggregation-api');
const delegates = require(__base + 'delegates');
const testHelpers = require(__base + 'utils/test-helpers');

describe('aggregation-api', () => {
  let requester;

  test('getByRequester should throw if a requester is not specified', async () => {
    let ok = true;
    try {
      await aggregationApi.getByRequester();
    } catch (error) {
      ok = false;
    }
    expect(ok).toBe(false);
  });

  test('create should set an ID', async () => {
    requester = await delegates.requesters.create({});
    let record = await aggregationApi.create({
      requester_id: requester.id,
      name: 'test',
      url: 'http://url'
    });
    expect(record.id).toBeDefined();
  });

  test('getByRequester should return the records associated with the requester', async () => {
    let records = await aggregationApi.getByRequester(requester.id);
    expect(records.meta.count).toBe(1);
  });

  test('getBuiltin should return the records with requester_id NULL', async () => {
    await testHelpers.createFakeAggregationApi();
    let records = await aggregationApi.getBuiltIn();
    expect(records.meta.count).toBeGreaterThan(0);
  });
});
