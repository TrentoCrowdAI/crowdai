// we map all configuration parameters here.

module.exports = {
  db: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    bucket: process.env.DB_BUCKET
  },
  rules: {
    maxTasks: process.env.MAX_TASKS_RULE,
    taskReward: process.env.TASK_REWARD_RULE,
    testFrequency: process.env.TEST_FREQUENCY_RULE,
    initialTests: process.env.INITIAL_TESTS,
    initialTestsMinCorrectAnswers:
      process.env.INITIAL_TEST_MIN_CORRECT_ANSWERS_RULE,
    votesPerTask: process.env.VOTES_PER_TASK_RULE
  }
};
