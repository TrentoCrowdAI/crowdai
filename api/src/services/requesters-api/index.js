const Router = require('koa-router');
let router = new Router();

require('./jobs').register(router);
require('./profile').register(router);
require('./csv-preview').register(router);
require('./reports').register(router);

module.exports = router.routes();
