const delegates = require(__base + 'delegates');

const post = async ctx => {
  // answer records are already created when we run the next task logic
  // therefore, we just have to update the record.
  ctx.response.body = await delegates.answers.update(ctx.request.fields);
};

exports.register = router => {
  router.post('/answers', post);
};
