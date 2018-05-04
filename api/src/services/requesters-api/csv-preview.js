const Boom = require('boom');
const request = require('request');
const url = require('url');

/**
 * This service is just a proxy to avoid CORS issues if we
 * fetch them from the frontend directly. This service is limited
 * to small files. Currently, we just use it for the filters csv file.
 *
 * @param {Object} ctx
 */
const getCSVPreview = async ctx => {
  const urlValue = ctx.query.url || '';
  const parsedUrl = url.parse(urlValue);

  if (!parsedUrl.hostname) {
    throw Boom.badRequest('URL parameter is required and must be a valid URL');
  }

  try {
    ctx.response.body = await new Promise((resolve, reject) => {
      request(urlValue, (err, rsp, body) => {
        if (err) {
          reject(err);
        } else {
          resolve(rsp.body);
        }
      });
    });
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch CSV file');
  }
};

exports.register = router => {
  router.get('/csv-preview', getCSVPreview);
};
