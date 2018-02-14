import {getActionTypes, getActions} from 'src/utils/form';
import {scopes} from 'src/utils/constants';

const actionTypes = {
  FETCH_EXPERIMENTS: 'C_FETCH_EXPERIMENTS',
  FETCH_EXPERIMENTS_SUCCESS: 'C_FETCH_EXPERIMENTS_SUCCESS',
  FETCH_EXPERIMENTS_ERROR: 'C_FETCH_EXPERIMENTS_ERROR',
  ...getActionTypes(scopes.EXPERIMENTS)
};

const actions = {
  fetchExperiments() {
    return {
      type: actionTypes.FETCH_EXPERIMENTS
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

  ...getActions(scopes.EXPERIMENTS)
};

export {actionTypes, actions};
