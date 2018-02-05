const delegates = require(__base + 'delegates');

const getWorkerReward = async ctx => {
  ctx.response.body = await delegates.workers.getWorkerReward(
    ctx.params.workerId
  );
};

exports.register = router => {
  router.get('/workers/:workerId/reward', getWorkerReward);
};
