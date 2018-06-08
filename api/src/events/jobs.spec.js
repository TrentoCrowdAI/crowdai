const { emit } = require('./emitter');
const jobsEvent = require('./jobs');
const { EventTypes } = require('./types');

jest.mock('cron');
const cron = require('cron');

test('jobs event module should be defined', () => {
  expect(jobsEvent).toBeDefined();
});

test(`${EventTypes.job.START_CRON_FOR_HIT} should set a cronjob`, () => {
  let cronSet = false;

  cron.CronJob.mockImplementation(options => {
    return {
      start() {
        cronSet = true;
      }
    };
  });

  emit(EventTypes.job.START_CRON_FOR_HIT, {}, '', {});
  expect(cronSet).toBe(true);
});
