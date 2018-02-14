const delegates = require(__base + 'delegates');

const get = async ctx => {
  let tasks = await delegates.tasks.all(ctx.params.experimentId);
  ctx.response.body = tasks;
};

const getNext = async ctx => {
  ctx.response.body = await delegates.tasks.next(
    ctx.params.experimentId,
    ctx.query.workerId
  );
};

exports.register = router => {
  router.get('/experiments/:experimentId/tasks', get);
  router.get('/experiments/:experimentId/tasks/next', getNext);
};
