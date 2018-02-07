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

const api = require('./services');

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

app.use(mount('/api/v1', api));

app.listen(process.env.PORT || 4000);
