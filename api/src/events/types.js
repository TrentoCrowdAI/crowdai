exports.EventTypes = {
  job: {
    START_CRON_FOR_HIT: 'START_CRON_FOR_HIT',
    // this event fires inside the jobManager.reviewAssignments method when
    // the /next-task service of the Task Assignment API returns DONE.
    NEXT_TASK_SERVICE_DONE: 'NEXT_TASK_SERVICE_DONE',
    // this event fires when the job have just been created.
    JOB_CREATED: 'JOB_CREATED'
  },

  project: {
    PROCESS_CSV: 'PROCESS_CSV'
  }
};
