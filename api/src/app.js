/**
 * Entrypoint.
 */
global.__base = __dirname + '/';

const Koa = require('koa');
const mount = require('koa-mount');
const logger = require('koa-logger');
const compress = require('koa-compress');
const responseTime = require('koa-response-time');
const koaBetterBody = require('koa-better-body');
const cors = require('koa2-cors');
const Boom = require('boom');

const workersApi = require('./services/workers-api');
const requestersApi = require('./services/requesters-api');
const auth = require('./services/auth');
const authentication = require('./middlewares/authentication');

const app = new Koa();

app.use(
  cors({
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept']
  })
);
app.use(logger());
app.use(responseTime());
app.use(compress());
app.use(koaBetterBody());

// google-based authentication protects URLs under /requesters
app.use(authentication.unless({ path: [/^\/auth/, /^\/workers/] }));

// error-handling middleware
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    console.error('Error', JSON.stringify(error));

    if (error.status === 401 && !error.isBoom) {
      const message = 'Not authorized to perform the request';
      error = Boom.unauthorized(message);
    }
    if (!error.isBoom) {
      error = Boom.badImplementation();
    }
    ctx.status = error.output.statusCode;
    ctx.body = error.output;
  }
});

app.use(mount('/workers/api/v1', workersApi));
app.use(mount('/requesters/api/v1', requestersApi));
app.use(mount('/auth', auth));

app.listen(process.env.PORT || 4000);
