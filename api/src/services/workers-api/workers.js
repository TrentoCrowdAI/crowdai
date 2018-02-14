const delegates = require(__base + 'delegates');

const getWorkerReward = async ctx => {
  ctx.response.body = await delegates.workers.getWorkerReward(
    ctx.params.experimentId,
    ctx.params.workerId
  );
};

const finishAssignment = async ctx => {
  ctx.response.body = await delegates.workers.finishAssignment(
    ctx.params.experimentId,
    ctx.params.workerId
  );
};

const checkAssignmentStatus = async ctx => {
  ctx.response.body = await delegates.workers.checkAssignmentStatus(
    ctx.params.experimentId,
    ctx.params.workerId
  );
};

exports.register = router => {
  router.get(
    '/experiments/:experimentId/workers/:workerId/reward',
    getWorkerReward
  );
  router.post(
    '/experiments/:experimentId/workers/:workerId/finish-assignment',
    finishAssignment
  );
  router.get(
    '/experiments/:experimentId/workers/:workerId/assignment-status',
    checkAssignmentStatus
  );
};
