const Boom = require('boom');

const delegates = require(__base + 'delegates');

const getRequesterProjects = async ctx => {
  // we use sub as requester primary key. Since is the userId inside Google API
  const { sub } = ctx.state.loginInfo;
  const loginInfo = ctx.state.loginInfo;
  let requester = await delegates.requesters.getRequesterByGid(sub);

  if (!requester) {
    throw Boom.badRequest('Requester account has not been initialized');
  }
  ctx.response.body = await delegates.projects.getByRequester(requester.id);
};

const getById = async ctx => {
  ctx.response.body = await delegates.projects.getById(ctx.params.id);
};

const post = async ctx => {
  ctx.response.body = await delegates.projects.create(ctx.request.fields);
};

const put = async ctx => {
  ctx.response.body = await delegates.projects.update(
    ctx.params.id,
    ctx.request.fields
  );
};

const copy = async ctx => {
  ctx.response.body = await delegates.projects.copy(ctx.params.id, true);
};

exports.register = router => {
  router.get('/projects', getRequesterProjects);
  router.post('/projects', post);
  router.put('/projects/:id', put);
  router.get('/projects/:id', getById);
  router.post('/projects/:id/copy', copy);
};
