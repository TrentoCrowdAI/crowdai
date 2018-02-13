const delegates = require(__base + 'delegates');

const get = async ctx => {
  let tasks = await delegates.tasks.all();
  ctx.response.body = tasks;
};

const getNext = async ctx => {
  ctx.response.body = await delegates.tasks.next(ctx.query.workerId);
};

exports.register = router => {
  router.get('/tasks', get);
  router.get('/tasks/next', getNext);
};
