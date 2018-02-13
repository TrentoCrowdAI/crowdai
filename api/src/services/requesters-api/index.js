const Router = require('koa-router');
let router = new Router();

require('./experiments').register(router);
require('./profile').register(router);

module.exports = router.routes();
