const Router = require('koa-router');
let router = new Router();

require('./tasks').register(router);
require('./answers').register(router);
require('./workers').register(router);
require('./experiments').register(router);

module.exports = router.routes();
