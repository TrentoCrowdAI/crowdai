const Boom = require('boom');

const delegates = require(__base + 'delegates');
const managers = require(__base + 'managers');

const getRequesterJobs = async ctx => {
  // we use sub as requester primary key. Since is the userId inside Google API
  const { sub } = ctx.state.loginInfo;
  let requester = await delegates.requesters.getRequesterByGid(sub);

  if (!requester) {
    throw Boom.badRequest('Requester account has not been initialized');
  }
  ctx.response.body = await delegates.jobs.getByRequester(requester.id);
};

const getById = async ctx => {
  ctx.response.body = await managers.job.getJobWithDetails(ctx.params.id);
};

const getState = async ctx => {
  ctx.response.body = await managers.job.getState(ctx.params.id);
};

const post = async ctx => {
  ctx.response.body = await delegates.jobs.create(ctx.request.fields);
};

const put = async ctx => {
  ctx.response.body = await delegates.jobs.update(
    ctx.params.id,
    ctx.request.fields
  );
};

const copy = async ctx => {
  ctx.response.body = await delegates.jobs.copy(ctx.params.id);
};

const publish = async ctx => {
  ctx.response.body = await managers.job.publish(ctx.params.id);
};

const checkCSVCreation = async ctx => {
  ctx.response.body = await delegates.jobs.checkCSVCreation(ctx.params.id);
};

exports.register = router => {
  router.get('/jobs', getRequesterJobs);
  router.post('/jobs', post);
  router.put('/jobs/:id', put);
  router.get('/jobs/:id', getById);
  router.post('/jobs/:id/publish', publish);
  router.get('/jobs/:id/state', getState);
  router.post('/jobs/:id/copy', copy);
  router.get('/jobs/:id/check-csv', checkCSVCreation);
};
