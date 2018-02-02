const post = async ctx => {
  console.log('payload', ctx.request.fields);
  ctx.response.body = ctx.request.fields;
};

exports.register = router => {
  router.post('/answers', post);
};
