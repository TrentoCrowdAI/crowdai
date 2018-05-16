const Boom = require('boom');

const delegates = require(__base + 'delegates');
const managers = require(__base + 'managers');

const TaskType = {
  TestTask: 'tt',
  Task: 't'
};

const getByUuid = async ctx => {
  let job = await delegates.jobs.getByUuid(ctx.params.uuid);
  let consent = await delegates.jobs.getConsent(job.data.consentUrl);
  const count =
    job.data.initialTestsRule +
    job.data.maxTasksRule +
    Math.floor(job.data.maxTasksRule / job.data.testFrequencyRule);
  const maxReward = count * job.data.taskRewardRule;
  // just return the necessary information
  ctx.response.body = {
    id: job.id,
    uuid: job.uuid,
    data: {
      initialTestsRule: job.data.initialTestsRule,
      maxTasksRule: job.data.maxTasksRule,
      minTasksRule: job.data.minTasksRule,
      taskRewardRule: job.data.taskRewardRule,
      consentUrl: job.data.consentUrl,
      consentFormat: job.data.consentFormat,
      consent: consent
    },
    maxReward: maxReward.toFixed(2)
  };
};

const getNext = async ctx => {
  let task = await managers.job.nextTask(
    ctx.params.uuid,
    ctx.query.workerId,
    ctx.query.assignmentId
  );

  if (!task.data.finished) {
    task.type = task.test_id ? TaskType.TestTask : TaskType.Task;
    task.data.criteria = task.data.criteria.map(c => ({
      id: c.id,
      label: c.label,
      description: c.description
    }));
    delete task.worker_id;
    delete task.job_id;
    delete task.test_id;
    delete task.item_id;
  }
  ctx.response.body = task;
};

const saveAnswer = async ctx => {
  // we save answers as an attribute in data JSON column.
  let payload = ctx.request.fields;
  const isTest = payload.task.type === TaskType.TestTask;
  ctx.response.body = await managers.job.saveAnswer(ctx.request.fields, isTest);
};

exports.register = router => {
  router.get('/jobs/:uuid', getByUuid);
  router.get('/jobs/:uuid/tasks/next', getNext);
  router.post('/jobs/:uuid/answers', saveAnswer);
};
