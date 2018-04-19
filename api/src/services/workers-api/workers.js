const delegates = require(__base + 'delegates');
const managers = require(__base + 'managers');

const getWorkerReward = async ctx => {
  let res = await managers.job.getWorkerReward(
    ctx.params.uuid,
    ctx.params.workerTurkId
  );
  ctx.response.body = {
    reward: res.reward.toFixed(2)
  };
};

const finishAssignment = async ctx => {
  ctx.response.body = await managers.state.forceFinish(
    ctx.params.uuid,
    ctx.params.workerTurkId,
    ctx.request.fields.finishedWithError
  );
};

const checkAssignmentStatus = async ctx => {
  const record = await delegates.workers.getAssignmentByWorkerTurkId(
    ctx.params.uuid,
    ctx.params.workerTurkId
  );

  ctx.response.body = record || { data: {} };
};

exports.register = router => {
  router.get('/jobs/:uuid/workers/:workerTurkId/reward', getWorkerReward);
  router.post(
    '/jobs/:uuid/workers/:workerTurkId/finish-assignment',
    finishAssignment
  );
  router.get(
    '/jobs/:uuid/workers/:workerTurkId/assignment-status',
    checkAssignmentStatus
  );
};
