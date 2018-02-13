const Router = require('koa-router');
let router = new Router();

require('./google').register(router);

module.exports = router.routes();
