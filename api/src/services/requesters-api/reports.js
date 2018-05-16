const Boom = require('boom');

const delegates = require(__base + 'delegates');

const getAllTasksByJob = async ctx => {
  ctx.response.body = await delegates.reports.getAllTasksByJob(ctx.params.id);
};

const getWorkersByJob = async ctx => {
  ctx.response.body = await delegates.reports.getWorkersByJob(ctx.params.id);
};

const getWorkerTimes = async ctx => {
  ctx.response.body = await delegates.reports.getWorkerTimes(ctx.params.jobId, ctx.params.workerId);
};

exports.register = router => {
  router.get('/getAllTasksByJob/:id', getAllTasksByJob);
  router.get('/getWorkerTimes/:jobId/:workerId', getWorkerTimes);
  router.get('/getWorkersByJob/:id', getWorkersByJob);
};
