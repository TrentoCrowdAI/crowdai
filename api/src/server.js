const app = require('./app');
const jobManager = require(__base + 'managers/job');

app.listen({ port: process.env.PORT || 4000 }, () => {
  jobManager.restartCronJobs();
});
