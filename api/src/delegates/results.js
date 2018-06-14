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

/**
 * Returns the entries in the result table for the given job.
 *
 * @param {Number} jobId
 * @param {Number} page
 * @param {Number} pageSize
 * @return {Object} The output format is:
 *
 * {
 *  rows: [...],
 *  meta: {
 *    count: 20,
 *    totalPages: 2,
 *    page: 1,
 *    pageSize: 10
 *  }
 *
 * }
 */
const getAll = (exports.getAll = async (jobId, page = 1, pageSize = 10) => {
  if (!jobId) {
    throw Boom.badRequest('The jobId parameter is required');
  }
  let job = await jobsDelegate.getById(jobId);

  if (!job) {
    throw Boom.badRequest(`The job with ID=${jobId} does not exist`);
  }

  const offset = (page - 1) * pageSize;
  let rsp = await db.query(
    `select r.*, i.data->'title' as title from ${db.TABLES.Result} r join ${
      db.TABLES.Item
    } i on (r.item_id = i.id)
    where r.job_id = $1 offset $2 limit $3`,
    [job.id, offset, pageSize]
  );
  let countRsp = await db.query(
    `select count(*) from ${db.TABLES.Result} where job_id = $1`,
    [job.id]
  );
  return {
    rows: rsp.rows,
    meta: {
      count: Number(countRsp.rows[0].count),
      totalPages: Math.ceil(Number(countRsp.rows[0].count) / pageSize),
      page,
      pageSize
    }
  };
});
