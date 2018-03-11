const Boom = require('boom');

const delegates = require(__base + 'delegates');

const getByUuid = async ctx => {
  let experiment = await delegates.experiments.getByUuid(ctx.params.uuid);
  let project = await delegates.projects.getById(experiment.project_id);
  // just return the necessary information
  ctx.response.body = {
    id: experiment.id,
    uuid: experiment.uuid,
    consentUrl: project.data.consentUrl,
    consentFormat: project.data.consentFormat,
    consent: project.consent
  };
};

const getNext = async ctx => {
  ctx.response.body = await delegates.nextTask.next(
    ctx.params.uuid,
    ctx.query.workerId,
    ctx.query.assignmentId
  );
};

const saveAnswer = async ctx => {
  // we save answers as an attribute in data JSON column.
  ctx.response.body = await delegates.answers.saveAnswer(ctx.request.fields);
};

exports.register = router => {
  router.get('/experiments/:uuid', getByUuid);
  router.get('/experiments/:uuid/tasks/next', getNext);
  router.post('/experiments/:uuid/answers', saveAnswer);
};
