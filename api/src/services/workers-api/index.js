const Router = require('koa-router');
let router = new Router();

require('./workers').register(router);
require('./experiments').register(router);

module.exports = router.routes();
