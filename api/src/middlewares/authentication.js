const { OAuth2Client } = require('google-auth-library');
const unless = require('koa-unless');
const Boom = require('boom');

const config = require(__base + 'config');

const middleware = async (ctx, next) => {
  if (!ctx.header.authorization) {
    ctx.status = 401;
    ctx.body = Boom.unauthorized('Token not found');
    return;
  }
  const parts = ctx.header.authorization.split(' ');

  if (parts.length === 2) {
    const scheme = parts[0];
    const token = parts[1];

    if (/^Bearer$/i.test(scheme)) {
      try {
        const client = new OAuth2Client(
          config.google.clientId,
          config.google.secret,
          ''
        );
        const decodedToken = await client.verifyIdToken({
          idToken: token,
          audience: config.google.clientId
        });
        ctx.state.loginInfo = decodedToken.payload;
      } catch (error) {
        console.error(error);
        ctx.status = 401;
        ctx.body = Boom.unauthorized('Authentication Error');
        return;
      }
      return next();
    }
  }
  ctx.status = 401;
  ctx.body = Boom.unauthorized(
    'Bad Authorization header format. Format is "Authorization: Bearer <token>"'
  );
};

middleware.unless = unless;

module.exports = middleware;
