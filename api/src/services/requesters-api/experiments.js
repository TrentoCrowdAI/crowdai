const Boom = require('boom');

const delegates = require(__base + 'delegates');

const getProjectExperiments = async ctx => {
  ctx.response.body = await delegates.experiments.getByProject(
    ctx.params.projectId
  );
};

const getById = async ctx => {
  ctx.response.body = await delegates.experiments.getById(ctx.params.id);
};

const post = async ctx => {
  ctx.response.body = await delegates.experiments.create(ctx.request.fields);
};

const put = async ctx => {
  ctx.response.body = await delegates.experiments.update(
    ctx.params.id,
    ctx.request.fields
  );
};

const publish = async ctx => {
  ctx.response.body = await delegates.experiments.publish(
    ctx.params.id,
    ctx.request.fields
  );
};

exports.register = router => {
  router.get('/projects/:projectId/experiments', getProjectExperiments);
  router.post('/projects/:projectId/experiments', post);
  router.put('/projects/:projectId/experiments/:id', put);
  router.get('/projects/:projectId/experiments/:id', getById);
  router.post('/projects/:projectId/experiments/:id/publish', publish);
};
