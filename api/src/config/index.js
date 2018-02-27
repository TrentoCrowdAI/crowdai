// we map all configuration parameters here.

module.exports = {
  db: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    bucket: process.env.DB_BUCKET
  },
  rules: {
    maxTasks: Number(process.env.MAX_TASKS_RULE),
    taskReward: Number(process.env.TASK_REWARD_RULE),
    testFrequency: Number(process.env.TEST_FREQUENCY_RULE),
    initialTests: Number(process.env.INITIAL_TESTS_RULE),
    initialTestsMinCorrectAnswers: Number(
      process.env.INITIAL_TEST_MIN_CORRECT_ANSWERS_RULE
    ),
    votesPerTask: Number(process.env.VOTES_PER_TASK_RULE)
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    secret: process.env.GOOGLE_CLIENT_SECRET
  },
  frontend: {
    url: process.env.FRONTEND_URL
  },
  mturk: {
    requesterSandboxUrl: process.env.MTURK_REQUESTER_SANDBOX_URL,
    requesterUrl: process.env.MTURK_REQUESTER_URL,
    region: process.env.MTURK_REGION
  },
  cron: {
    hitStatusPollTime: process.env.HIT_STATUS_POLL_TIME
  }
};
