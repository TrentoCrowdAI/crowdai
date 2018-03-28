const Boom = require('boom');

const delegates = require(__base + 'delegates');

const getAllTasksByJobId = async ctx => {
  ctx.response.body = await delegates.reports.getAllTasksByJobId(ctx.params.id);
};

exports.register = router => {
  router.get('/allTasksByJobId/:id', getAllTasksByJobId);
};
