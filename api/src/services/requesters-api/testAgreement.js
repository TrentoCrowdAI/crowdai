const Boom = require('boom');

const delegates = require(__base + 'delegates');

const workerAnswers = async ctx => {
  ctx.response.body = await delegates.testAgreement.workerAnswers(ctx.params.id);
};

const getWorkersByJob = async ctx => {
  ctx.response.body = await delegates.testAgreement.getWorkersByJob(ctx.params.id);
};

const allPossibleCouplesOfWorkersAndNumberOfCommonTask = async ctx => {
  ctx.response.body = await delegates.testAgreement.allPossibleCouplesOfWorkersAndNumberOfCommonTask();
};

const forASelectedWorkerShowAllWorkers = async ctx => {
  ctx.response.body = await delegates.testAgreement.forASelectedWorkerShowAllWorkers();
};

const getByJobId = async ctx => {
  ctx.response.body = await delegates.testAgreement.getByJobId(ctx.params.id);
};

const getTaskByWorkerId = async ctx => {
  ctx.response.body = await delegates.testAgreement.getTaskByWorkerId(ctx.params.id);
};

exports.register = router => {
  router.get('/workerAnswers/:id', workerAnswers);
  router.get('/allPossibleCouplesOfWorkersAndNumberOfCommonTask', allPossibleCouplesOfWorkersAndNumberOfCommonTask);
  router.get('/forASelectedWorkerShowAllWorkers', forASelectedWorkerShowAllWorkers);
  router.get('/getByJobId/:id', getByJobId);
  router.get('/getTaskByWorkerId/:id', getTaskByWorkerId);
  router.get('/getWorkersByJob/:id', getWorkersByJob);
};
