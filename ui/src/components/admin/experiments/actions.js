import {getActionTypes, getActions} from 'src/utils/form';
import {scopes} from 'src/utils/constants';

const actionTypes = {
  FETCH_EXPERIMENTS: 'C_FETCH_EXPERIMENTS',
  FETCH_EXPERIMENTS_SUCCESS: 'C_FETCH_EXPERIMENTS_SUCCESS',
  FETCH_EXPERIMENTS_ERROR: 'C_FETCH_EXPERIMENTS_ERROR',
  PUBLISH_EXPERIMENT: 'C_PUBLISH_EXPERIMENT',
  PUBLISH_EXPERIMENT_SUCCESS: 'C_PUBLISH_EXPERIMENT_SUCCESS',
  PUBLISH_EXPERIMENT_ERROR: 'C_PUBLISH_EXPERIMENT_ERROR',
  ...getActionTypes(scopes.EXPERIMENTS)
};

const actions = {
  fetchExperiments(projectId) {
    return {
      type: actionTypes.FETCH_EXPERIMENTS,
      projectId
    };
  },

  fetchExperimentsSuccess(response) {
    return {
      type: actionTypes.FETCH_EXPERIMENTS_SUCCESS,
      response
    };
  },

  fetchExperimentsError(error) {
    return {
      type: actionTypes.FETCH_EXPERIMENTS_ERROR,
      error
    };
  },

  publish() {
    return {
      type: actionTypes.PUBLISH_EXPERIMENT
    };
  },

  publishSuccess(experiment) {
    return {
      type: actionTypes.PUBLISH_EXPERIMENT_SUCCESS,
      experiment
    };
  },

  publishError(error) {
    return {
      type: actionTypes.PUBLISH_EXPERIMENT_ERROR,
      error
    };
  },

  ...getActions(scopes.EXPERIMENTS),

  fetchItem(id, isWorker = false) {
    return {
      type: actionTypes.FETCH_ITEM,
      id,
      isWorker
    };
  }
};

export {actionTypes, actions};
