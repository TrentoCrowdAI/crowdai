const { OAuth2Client } = require('google-auth-library');
const unless = require('koa-unless');

const config = require(__base + 'config');

const middleware = async (ctx, next) => {
  if (!ctx.header.authorization) {
    ctx.throw(401, 'Token not found');
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
        ctx.throw(401, 'Authentication Error');
      }
      return next();
    }
  }

  ctx.throw(
    401,
    'Bad Authorization header format. Format is "Authorization: Bearer <token>"'
  );
};

middleware.unless = unless;

module.exports = middleware;
