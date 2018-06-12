exports.EventTypes = {
  job: {
    START_CRON_FOR_HIT: 'START_CRON_FOR_HIT',
    // this event fires when the job have just been created.
    JOB_CREATED: 'JOB_CREATED',
    // this event fires when the job review finishes.
    JOB_REVIEW_DONE: 'JOB_REVIEW_DONE'
  },

  project: {
    PROCESS_CSV: 'PROCESS_CSV'
  }
};
