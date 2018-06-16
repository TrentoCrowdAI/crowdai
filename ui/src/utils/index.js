import moment from 'moment';
import {UserModes} from './constants';

/**
 * Helper method that flattens an error returned by the API.
 *
 * @param {Object} error
 * @return {Object} {message: 'The error message', ...}
 */
const flattenError = error => {
  let err = {};

  if (error.response && error.response.data) {
    if (typeof error.response.data === 'object') {
      err = error.response.data.payload || error.response.data;
    } else if (typeof error.response.data === 'string') {
      err.message = error.response.data;
    }
  } else {
    err.message = 'There was a problem processing your request.';
  }
  return err;
};

/**
 * Checks if the given profile is an expert user.
 *
 * @param {Object} profile
 * @return {Boolean}
 */
const isExpertMode = profile => profile.data.userMode === UserModes.Researcher;

/**
 * Formats the given (string) datetime value.
 * @param {String} datetime - String representing a datetime value. Format: YYYY-MM-DDTHH:mm:ss.S Z
 * @return {String} formated datetime value. Format: DD-MM-YYYY HH:mm:ss
 */
const datetimeFormatter = datetime => moment(datetime, 'YYYY-MM-DDTHH:mm:ss.S Z').format('DD-MM-YYYY HH:mm:ss');

export {flattenError, datetimeFormatter, isExpertMode};
