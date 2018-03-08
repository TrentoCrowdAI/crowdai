import {getActionTypes, getActions} from 'src/utils/form';
import {scopes} from 'src/utils/constants';

const actionTypes = {
  FETCH_PROJECTS: 'C_FETCH_PROJECTS',
  FETCH_PROJECTS_SUCCESS: 'C_FETCH_PROJECTS_SUCCESS',
  FETCH_PROJECTS_ERROR: 'C_FETCH_PROJECTS_ERROR',
  ...getActionTypes(scopes.PROJECTS)
};

const actions = {
  fetchProjects() {
    return {
      type: actionTypes.FETCH_PROJECTS
    };
  },

  fetchProjectsSuccess(response) {
    return {
      type: actionTypes.FETCH_PROJECTS_SUCCESS,
      response
    };
  },

  fetchProjectsError(error) {
    return {
      type: actionTypes.FETCH_PROJECTS_ERROR,
      error
    };
  },

  ...getActions(scopes.PROJECTS)
};

export {actionTypes, actions};
