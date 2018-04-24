const { emit } = require('./emitter');
const jobsEvent = require('./jobs');
jest.mock('cron');
const cron = require('cron');

test('jobs event module should be defined', () => {
  expect(jobsEvent).toBeDefined();
});

test('jobs event module should exports EventTypes', () => {
  expect(jobsEvent.EventTypes).toBeDefined();
});

test(`${jobsEvent.EventTypes.START_CRON_FOR_HIT} should set a cronjob`, () => {
  let cronSet = false;

  cron.CronJob.mockImplementation(options => {
    return {
      start() {
        cronSet = true;
      }
    };
  });

  emit(jobsEvent.EventTypes.START_CRON_FOR_HIT, {}, '', {});
  expect(cronSet).toBe(true);
});
