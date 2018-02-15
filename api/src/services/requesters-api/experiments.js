const Boom = require('boom');

const delegates = require(__base + 'delegates');

const getRequesterExperiments = async ctx => {
  // we use sub as requester primary key. Since is the userId inside Google API
  const { sub } = ctx.state.loginInfo;
  const loginInfo = ctx.state.loginInfo;
  let requester = await delegates.requesters.getRequesterById(sub);

  if (!requester) {
    throw Boom.badRequest('Requester account has not been initialized');
  }
  ctx.response.body = {
    experiments: await delegates.experiments.getByRequester(
      requester.requesterId
    )
  };
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
  router.get('/experiments', getRequesterExperiments);
  router.post('/experiments', post);
  router.put('/experiments/:id', put);
  router.get('/experiments/:id', getById);
  router.post('/experiments/:id/publish', publish);
};
