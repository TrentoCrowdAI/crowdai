const taskAssignmentApi = require('./task-assignment-api');
const delegates = require(__base + 'delegates');
const testHelpers = require(__base + 'utils/test-helpers');

describe('task-assignment-api', () => {
  let requester;

  test('getByRequester should throw if a requester is not specified', async () => {
    let ok = true;
    try {
      await taskAssignmentApi.getByRequester();
    } catch (error) {
      ok = false;
    }
    expect(ok).toBe(false);
  });

  test('create should set an ID', async () => {
    requester = await delegates.requesters.create({});
    let record = await taskAssignmentApi.create({
      requester_id: requester.id,
      name: 'test',
      url: 'http://url',
      aggregation: false
    });
    expect(record.id).toBeDefined();
  });

  test('getByRequester should return the records associated with the requester', async () => {
    let records = await taskAssignmentApi.getByRequester(requester.id);
    expect(records.meta.count).toBe(1);
  });

  test('getBuiltin should return the records with requester_id NULL', async () => {
    await testHelpers.createFakeTaskAssignmentApi();
    let records = await taskAssignmentApi.getBuiltIn();
    expect(records.meta.count).toBe(1);
  });
});
