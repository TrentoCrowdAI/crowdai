const Boom = require('boom');

const jobsDelegate = require('./jobs');
const db = require(__base + 'db');
const { ResultOutcomes } = require(__base + 'utils/constants');
const projectsDelegate = require('./projects');

/**
 * Returns a summary of the results for the given job.
 *
 * @param {Number} jobId
 * @return {Object} Output format is:
 * @example
 *
 * {
 *    in: <number of papers in>,
 *    out: <number of papers out>,
 *    stopped: <number of papers that are too difficult to classify>,
 *    pending: <number of papers left>
 * }
 */
const getSummary = (exports.getSummary = async jobId => {
  if (!jobId) {
    throw Boom.badRequest('The jobId parameter is required');
  }
  let job = await jobsDelegate.getById(jobId);

  if (!job) {
    throw Boom.badRequest(`The job with ID=${jobId} does not exist`);
  }
  let summary = { in: 0, out: 0, stopped: 0, pending: 0 };
  let rsp = await db.query(
    `select count(*), data->'outcome' as outcome from ${
      db.TABLES.Result
    } where job_id = $1 group by data->'outcome'`,
    [job.id]
  );
  let sum = 0;

  for (let r of rsp.rows) {
    r.count = Number(r.count);
    summary[r.outcome.toLowerCase()] = r.count;
    sum += r.count;
  }
  let itemsCount = await projectsDelegate.getItemsCount(job.project_id);
  summary.pending = itemsCount - sum;
  return summary;
});
