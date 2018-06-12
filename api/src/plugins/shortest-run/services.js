/*
 * Additional services related to Shortest Run algorithm. These services relate 
 * to different states of the algorithm and augment the standard services of the
 * Task Assignment API.
 */
require('./listener'); // we register the listener module.
const shortestRunManager = require('./manager');

/**
 * POST /shortest-run/generate-baseline
 * {
 *   jobId: <number>
 * }
 * @param {Object} ctx
 */
const generateBaseline = async ctx => {
  const jobId = ctx.request.fields.jobId;
  ctx.response.body = await shortestRunManager.generateBaseline(jobId);
};

/**
 * POST /shortest-run/assign-filters
 * {
 *   jobId: <number>
 * }
 * @param {Object} ctx
 */
const assignFilters = async ctx => {
  const jobId = ctx.request.fields.jobId;
  ctx.response.body = await shortestRunManager.assignFilters(jobId);
};

exports.register = router => {
  router.post('/shortest-run/assign-filters', assignFilters);
  router.post('/shortest-run/generate-baseline', generateBaseline);
};
