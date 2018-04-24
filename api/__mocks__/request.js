/**
 * Very tiny mock for the request module.
 */

module.exports = function request(url, callback) {
  callback(null, {}, {});
};
