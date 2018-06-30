const moment = require('moment');
const uuid = require('uuid/v4');
const request = require('request');

const taskManager = require('./task');
const jobManager = require('./job');
const testHelpers = require(__base + 'utils/test-helpers');
const delegates = require(__base + 'delegates');

test('createAdditionalAssignmentsForHIT should create 5 additional assignments', async () => {
  let called = false;
  let payload;
  let mturk = {
    createAdditionalAssignmentsForHIT(params, cb) {
      payload = params;
      cb(null, {});
    },

    updateExpirationForHIT(params, cb) {
      called = true;
      cb(null, {});
    }
  };
  let spy = jest
    .spyOn(taskManager, 'getPendingVotes')
    .mockImplementation(() => {
      return [
        { item: 1, filter: 1, pending: 2 },
        { item: 2, filter: 1, pending: 2 },
        { item: 3, filter: 2, pending: 2 },
        { item: 4, filter: 2, pending: 3 }
      ];
    });

  let job = { data: { maxTasksRule: 2 } };
  let hit = {
    HITId: '1',
    HITStatus: 'Reviewable',
    Expiration: moment()
      .subtract(1, 'h')
      .format('YYYY-MM-DDTHH:mm:ss.S Z')
  };
  await jobManager.createAdditionalAssignmentsForHIT(job, hit, mturk);
  expect(called).toBe(true);
  expect(payload.NumberOfAdditionalAssignments).toBeDefined();
  expect(payload.NumberOfAdditionalAssignments).toBe(5);
  spy.mockRestore();
});

describe('computeEstimates', () => {
  test('should throw if jobId is undefined', async () => {
    let ok = true;
    try {
      await jobManager.computeEstimates();
    } catch (error) {
      ok = false;
    }
    expect(ok).toBe(false);
  });

  test('should throw if job does not exist', async () => {
    let ok = true;
    try {
      await jobManager.computeEstimates(0);
    } catch (error) {
      ok = false;
    }
    expect(ok).toBe(false);
  });

  test('should set job.data.estimationToken', async () => {
    const token = uuid();
    let request = require('request');
    request.mockImplementation((url, callback) =>
      callback(null, { body: { token } })
    );
    let job = await testHelpers.createJob(30, 3, {
      maxTasksRule: 2,
      initialTestsRule: 1,
      votesPerTaskRule: 3
    });

    let response = await jobManager.computeEstimates(job.id, true);
    job = await delegates.jobs.getById(job.id);
    expect(response).toBeDefined();
    expect(response.token).toBeDefined();
    expect(response.token).toBe(token);
    expect(job.data.estimationToken).toBeDefined();
    expect(job.data.estimationToken).toBe(token);
    request.mockRestore();
  });
});
