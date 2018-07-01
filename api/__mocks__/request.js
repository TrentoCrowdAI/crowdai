/**
 * Very tiny mock for the request module.
 */

module.exports = jest.fn(function request(url, callback) {
  callback(null, {}, {});
});
