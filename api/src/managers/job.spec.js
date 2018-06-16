const moment = require('moment');

const taskManager = require('./task');
const jobManager = require('./job');

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
