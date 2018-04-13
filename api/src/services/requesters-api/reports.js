const Boom = require('boom');

const delegates = require(__base + 'delegates');

const getAllTasksByJobId = async ctx => {
  ctx.response.body = await delegates.reports.getAllTasksByJobId(ctx.params.id);
};

const getAllWorkersByJobId = async ctx => {
  ctx.response.body = await delegates.reports.getAllWorkersByJobId(ctx.params.id);
};

const getWorkerTimes = async ctx => {
  ctx.response.body = await delegates.reports.getWorkerTimes(ctx.params.id);
};

exports.register = router => {
  router.get('/allTasksByJobId/:id', getAllTasksByJobId);
  router.get('/allWorkersByJobId/:id', getAllWorkersByJobId);
  router.get('/allWorkerTimes/:id', getWorkerTimes);
};
