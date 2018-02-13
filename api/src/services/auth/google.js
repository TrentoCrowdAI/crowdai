const authentication = require(__base + 'middlewares/authentication');

const verifyTokenId = async ctx => {
  ctx.response.body = ctx.state.loginInfo;
};

exports.register = router => {
  router.get('/google/verify', authentication, verifyTokenId);
};
