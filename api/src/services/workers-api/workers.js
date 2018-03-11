const delegates = require(__base + 'delegates');

const getWorkerReward = async ctx => {
  ctx.response.body = await delegates.workers.getWorkerReward(
    ctx.params.uuid,
    ctx.params.workerTurkId
  );
};

const finishAssignment = async ctx => {
  ctx.response.body = await delegates.workers.finishAssignment(
    ctx.params.uuid,
    ctx.params.workerTurkId
  );
};

const checkAssignmentStatus = async ctx => {
  const record = await delegates.workers.checkAssignmentStatus(
    ctx.params.uuid,
    ctx.params.workerTurkId
  );

  ctx.response.body = record || {};
};

exports.register = router => {
  router.get(
    '/experiments/:uuid/workers/:workerTurkId/reward',
    getWorkerReward
  );
  router.post(
    '/experiments/:uuid/workers/:workerTurkId/finish-assignment',
    finishAssignment
  );
  router.get(
    '/experiments/:uuid/workers/:workerTurkId/assignment-status',
    checkAssignmentStatus
  );
};
