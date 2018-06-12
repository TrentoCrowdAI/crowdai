/**
 * This module setup event listeners for jobs-related events.
 */
const CronJob = require('cron').CronJob;

const { on } = require('./emitter');
const jobManager = require(__base + 'managers/job');
const config = require(__base + 'config');
const { EventTypes } = require('./types');

/**
 * This listener setup a cronjob that will check the progress
 * of the given job and its associated HIT.
 *
 * The parameters of the listener are:
 *  @param {Object} job
 *  @param {String} hitId
 *  @param {Object} mturk
 *
 * To emit this event do the following:
 *
 * @example
 *
 * emit(EventTypes.job.START_CRON_FOR_HIT, job, hitId, mt);
 *
 */
exports.onStartCronForHit = (job, hitId, mturk) => {
  const jobId = job.id;
  const cronjob = new CronJob({
    cronTime: `0 */${config.cron.hitStatusPollTime} * * * *`,
    onTick: async () => {
      console.log(`Checking HIT: ${hitId} status`);

      try {
        let hit = await jobManager.getHIT(hitId, mturk);
        console.log(`HIT: ${hitId} is ${hit.HITStatus}`);
        const stop = await jobManager.reviewAssignments(job, hit, mturk);

        if (stop) {
          console.log(`Stopping cron job for HIT: ${hitId}`);
          cronjob.stop();
        }
      } catch (error) {
        console.error(error);
      }
    },
    start: false
  });

  cronjob.start();
};

// we register the handler
on(EventTypes.job.START_CRON_FOR_HIT, (job, hitId, mturk) =>
  exports.onStartCronForHit(job, hitId, mturk)
);
