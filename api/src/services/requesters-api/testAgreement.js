const Boom = require('boom');

const delegates = require(__base + 'delegates');

const allPossibleCouplesOfWorkersAndNumberOfCommonTask = async ctx => {
  ctx.response.body = await delegates.testAgreement.allPossibleCouplesOfWorkersAndNumberOfCommonTask();
};

const forASelectedWorkerShowAllWorkers = async ctx => {
  ctx.response.body = await delegates.testAgreement.forASelectedWorkerShowAllWorkers();
};

exports.register = router => {
  router.get('/allPossibleCouplesOfWorkersAndNumberOfCommonTask', allPossibleCouplesOfWorkersAndNumberOfCommonTask);
  router.get('/forASelectedWorkerShowAllWorkers', forASelectedWorkerShowAllWorkers);
};
