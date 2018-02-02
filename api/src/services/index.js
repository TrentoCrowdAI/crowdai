const Router = require('koa-router');
let router = new Router();

require('./tasks').register(router);
require('./answers').register(router);

module.exports = router.routes();
