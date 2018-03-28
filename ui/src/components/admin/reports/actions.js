import {getActionTypes, getActions} from 'src/utils/form';
import {scopes} from 'src/utils/constants';

const actionTypes = {
  FETCH_REPORTS: 'C_REPORTS_CHART',
  FETCH_REPORTS_SUCCESS: 'C_FETCH_REPORTS_SUCCESS',
  FETCH_REPORTS_ERROR: 'C_FETCH_REPORTS_ERROR',
  ...getActionTypes(scopes.REPORTS)
};

const actions = {
  fetchProjects() {
    return {
      type: actionTypes.FETCH_REPORTS
    };
  },

  fetchProjectsSuccess(response) {
    return {
      type: actionTypes.FETCH_REPORTS_SUCCESS,
      response
    };
  },

  fetchProjectsError(error) {
    return {
      type: actionTypes.FETCH_REPORTS_ERROR,
      error
    };
  },

  ...getActions(scopes.REPORTS)
};

export {actionTypes, actions};