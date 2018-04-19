import {getActionTypes, getActions} from 'src/utils/form';
import {scopes} from 'src/utils/constants';

const actionTypes = {
  FETCH_PROJECTS: 'C_FETCH_PROJECTS',
  FETCH_PROJECTS_SUCCESS: 'C_FETCH_PROJECTS_SUCCESS',
  FETCH_PROJECTS_ERROR: 'C_FETCH_PROJECTS_ERROR',
  FETCH_PROJECT_STATE: 'C_FETCH_PROJECT_STATE',
  FETCH_PROJECT_STATE_SUCCESS: 'C_FETCH_PROJECT_STATE_SUCCESS',
  FETCH_PROJECT_STATE_ERROR: 'C_FETCH_PROJECT_STATE_ERROR',
  POLL_PROJECT: 'C_POLL_PROJECT',
  POLL_PROJECT_DONE: 'C_POLL_PROJECT_DONE',
  COPY_PROJECT: 'C_COPY_PROJECT',
  COPY_PROJECT_SUCCESS: 'C_COPY_PROJECT_SUCCESS',
  COPY_PROJECT_ERROR: 'C_COPY_PROJECT_ERROR',
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

  fetchProjectState(id) {
    return {
      type: actionTypes.FETCH_PROJECT_STATE,
      id
    };
  },

  fetchProjectStateSuccess() {
    return {
      type: actionTypes.FETCH_PROJECT_STATE_SUCCESS
    };
  },

  fetchProjectStateError() {
    return {
      type: actionTypes.FETCH_PROJECT_STATE_ERROR
    };
  },

  pollProject(id) {
    return {
      type: actionTypes.POLL_PROJECT,
      id
    };
  },

  pollProjectDone(id) {
    return {
      type: actionTypes.POLL_PROJECT_DONE,
      id
    };
  },

  copyProject(id) {
    return {
      type: actionTypes.COPY_PROJECT,
      id
    };
  },

  copyProjectSuccess(copiedProject) {
    return {
      type: actionTypes.COPY_PROJECT_SUCCESS,
      copiedProject
    };
  },

  copyProjectError(error) {
    return {
      type: actionTypes.COPY_PROJECT_ERROR,
      error
    };
  },

  ...getActions(scopes.PROJECTS)
};

export {actionTypes, actions};
