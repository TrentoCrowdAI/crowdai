const Boom = require('boom');

const delegates = require(__base + 'delegates');

const getWorkerAnswers = async ctx => {
  ctx.response.body = await delegates.reports.getWorkerAnswers(ctx.params.jobId, ctx.params.workerId);
};

const getAllTasksTimesByJob = async ctx => {
  ctx.response.body = await delegates.reports.getAllTasksTimesByJob(ctx.params.id);
};

const getWorkersByJob = async ctx => {
  ctx.response.body = await delegates.reports.getWorkersByJob(ctx.params.id);
};

const getWorkerTimes = async ctx => {
  ctx.response.body = await delegates.reports.getWorkerTimes(ctx.params.jobId, ctx.params.workerId);
};

const getTasksAgreements = async ctx => {
  ctx.response.body = await delegates.reports.getTasksAgreements(ctx.params.id);
};

const getWorkersAgreements = async ctx => {
  ctx.response.body = await delegates.reports.getWorkersAgreements(ctx.params.jobId);
};

const getCrowdGolds = async ctx => {
  ctx.response.body = await delegates.reports.getCrowdGolds(ctx.params.jobId);
};

const getWorkersPairs = async ctx => {
  //let risposta = await delegates.reports.getStatsPairOfWorkerSameJob(ctx.params.jobId);
  //ctx.response.body = JSON.stringify(risposta, null, 2);
  ctx.response.body = await delegates.reports.getWorkersPairs(ctx.params.jobId);
};

const singleWorker = async ctx => {
  ctx.response.body = await delegates.reports.singleWorker(ctx.params.jobId, ctx.params.workerId);
};

const contribution = async ctx => {
  ctx.response.body = await delegates.reports.contribution(ctx.params.jobId);
};

const jobStats = async ctx => {
  ctx.response.body = await delegates.reports.jobStats(ctx.params.jobId);
};

exports.register = router => {
  router.get('/getAllTasksTImesByJob/:id', getAllTasksTimesByJob);
  router.get('/getWorkerTimes/:jobId/:workerId', getWorkerTimes);
  router.get('/getWorkersByJob/:id', getWorkersByJob);
  router.get('/getWorkerAnswers/:jobId/:workerId', getWorkerAnswers);
  router.get('/getTasksAgreements/:id', getTasksAgreements);
  router.get('/getWorkersAgreements/:jobId', getWorkersAgreements);
  router.get('/getCrowdGolds/:jobId', getCrowdGolds);
  router.get('/ww/job/:jobId/stats', getWorkersPairs);
  router.get('/worker/:workerId/job/:jobId/stats', singleWorker);
  router.get('/worker/job/:jobId/contribution', contribution);
  router.get('/global/job/:jobId/stats', jobStats);
};
