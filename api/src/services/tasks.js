const get = async ctx => {
  // TODO: read from db
  ctx.response.body = tasks;
};

const getNext = async ctx => {
  // TODO: read from db
  ctx.response.body = tasks[Math.floor(Math.random() * tasks.length)];
};

exports.register = router => {
  router.get('/tasks', get);
  router.get('/tasks/next', getNext);
};
