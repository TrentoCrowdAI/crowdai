const delegates = require(__base + 'delegates');

/**
 * Calls the corresponding aggregation endpoint for the given job.
 *
 * @param {Number} jobId
 * @param {Number} aggregationId
 */
exports.aggregate = async (jobId, aggregationId) => {
  // TODO: call the aggregation endpoint. This should also update the job,
  // setting the data.aggregationStrategy property to aggregationId
};
