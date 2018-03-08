const Boom = require('boom');

const delegates = require(__base + 'delegates');

const get = async ctx => {
  // we use sub as requester id. Since is the userId inside Google API
  const { sub } = ctx.state.loginInfo;
  const loginInfo = ctx.state.loginInfo;
  let requester = await delegates.requesters.getRequesterByGid(sub);

  if (!requester) {
    // create requester record
    requester = await delegates.requesters.create({
      gid: sub,
      email: loginInfo.email,
      name: loginInfo.name,
      picture: loginInfo.picture,
      givenName: loginInfo.given_name,
      familyName: loginInfo.family_name
    });
  }
  delete requester.data.secretAccessKey;
  ctx.response.body = requester;
};

const put = async ctx => {
  ctx.response.body = await delegates.requesters.update(
    ctx.params.id,
    ctx.request.fields
  );
};

exports.register = router => {
  router.get('/profile', get);
  router.put('/profile/:id', put);
};
