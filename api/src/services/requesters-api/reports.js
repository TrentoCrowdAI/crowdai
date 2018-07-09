const Boom = require('boom');

const delegates = require(__base + 'delegates');

const getAllTasksTimesByJob = async ctx => {
  ctx.response.body = await delegates.reports.getAllTasksTimesByJob(ctx.params.id);
};

const getWorkersByJob = async ctx => {
  ctx.response.body = await delegates.reports.getWorkersByJob(ctx.params.id);
};

const getTasksAgreements = async ctx => {
  ctx.response.body = await delegates.reports.getTasksAgreements(ctx.params.id);
};

const getCrowdGolds = async ctx => {
  ctx.response.body = await delegates.reports.getCrowdGolds(ctx.params.jobId);
};

const getWorkersPairs = async ctx => {
  ctx.response.body = await delegates.reports.getWorkersPairs(ctx.params.jobId);
};

const getSingleWorker = async ctx => {
  ctx.response.body = await delegates.reports.getSingleWorker(ctx.params.jobId, ctx.params.workerId);
};

const getContribution = async ctx => {
  ctx.response.body = await delegates.reports.getContribution(ctx.params.jobId);
};

const getJobStats = async ctx => {
  ctx.response.body = await delegates.reports.getJobStats(ctx.params.jobId);
};

exports.register = router => {
  router.get('/getAllTasksTimesByJob/:id', getAllTasksTimesByJob);
  router.get('/getWorkersByJob/:id', getWorkersByJob);
  router.get('/getTasksAgreements/:id', getTasksAgreements);
  router.get('/getCrowdGolds/:jobId', getCrowdGolds);
  router.get('/ww/job/:jobId/stats', getWorkersPairs);
  router.get('/worker/:workerId/job/:jobId/stats', getSingleWorker);
  router.get('/worker/job/:jobId/contribution', getContribution);
  router.get('/global/job/:jobId/stats', getJobStats);
};
