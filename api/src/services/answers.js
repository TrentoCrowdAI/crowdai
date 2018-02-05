const delegates = require(__base + 'delegates');

const post = async ctx => {
  ctx.response.body = await delegates.answers.create(ctx.request.fields);
};

exports.register = router => {
  router.post('/answers', post);
};
