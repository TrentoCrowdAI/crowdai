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
  }
};
