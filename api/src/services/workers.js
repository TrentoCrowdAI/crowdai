const delegates = require(__base + 'delegates');

const getWorkerReward = async ctx => {
  ctx.response.body = await delegates.workers.getWorkerReward(
    ctx.params.workerId
  );
};

const finishAssignment = async ctx => {
  ctx.response.body = await delegates.workers.finishAssignment(
    ctx.params.workerId
  );
};

const checkAssignmentStatus = async ctx => {
  ctx.response.body = await delegates.workers.checkAssignmentStatus(
    ctx.params.workerId
  );
};

exports.register = router => {
  router.get('/workers/:workerId/reward', getWorkerReward);
  router.post('/workers/:workerId/finish-assignment', finishAssignment);
  router.get('/workers/:workerId/assignment-status', checkAssignmentStatus);
};
