/**
 * Additional services related to Shortest Run algorithm. This
 * services are associated with the different states of the algorithm.
 */
const Boom = require('boom');
const request = require('request');

const delegates = require(__base + 'delegates');
const managers = require(__base + 'managers');

/**
 * POST /shortest-run/assign-filters
 * {
 *   jobId: <number>
 * }
 * @param {Object} ctx
 */
const assignFilters = async ctx => {
  const jobId = ctx.request.fields.jobId;
  if (!jobId) {
    throw Boom.badRequest('The job ID is required');
  }
  let job = await delegates.jobs.getById(jobId);
  let taskAssignmentApi = await delegates.taskAssignmentApi.getById(
    job.data.taskAssignmentStrategy
  );
  let url = `${managers.task.getUrl(taskAssignmentApi)}/generate-tasks`;
  // TODO: remove this fixed payload when the EM step is implemented.
  let payload = {
    jobId: job.id,
    criteria: {
      41: { accuracy: 0.85, selectivity: 0.28 },
      42: { accuracy: 0.9, selectivity: 0.28 },
      43: { accuracy: 0.86, selectivity: 0.42 }
    },
    stopScore: 30,
    outThreshold: 0.99
  };

  let response = await new Promise((resolve, reject) => {
    request(
      {
        url,
        method: 'POST',
        json: {
          ...payload
        }
      },
      (err, rsp, body) => {
        if (err) {
          reject(err);
        } else {
          resolve(rsp.body);
        }
      }
    );
  });

  if (response && response === 'filters_assigned') {
    response = {
      message: 'filters_assigned'
    };
  }
  ctx.response.body = response;
};

exports.register = router => {
  router.post('/shortest-run/assign-filters', assignFilters);
};
