const Boom = require('boom');

const delegates = require(__base + 'delegates');

const getById = async ctx => {
  let experiment = await delegates.experiments.getById(ctx.params.id);
  // just return the necessary information
  ctx.response.body = {
    id: experiment.id,
    consentUrl: experiment.consentUrl,
    consentFormat: experiment.consentFormat,
    consent: experiment.consent
  };
};

exports.register = router => {
  router.get('/experiments/:id', getById);
};
