const Router = require('koa-router');
let router = new Router();

require('./jobs').register(router);
require('./profile').register(router);
require('./csv-preview').register(router);

require('./shortest-run').register(router);

module.exports = router.routes();
