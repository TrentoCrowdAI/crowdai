const Router = require('koa-router');
let router = new Router();

require('./jobs').register(router);
require('./profile').register(router);
require('./projects').register(router);
require('./reports').register(router);

module.exports = router.routes();
