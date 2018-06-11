const Router = require('koa-router');
let router = new Router();

require('./jobs').register(router);
require('./profile').register(router);
require('./csv-preview').register(router);
require('./task-assignment-strategies').register(router);

require(__base + 'plugins/shortest-run/services').register(router);

module.exports = router.routes();
