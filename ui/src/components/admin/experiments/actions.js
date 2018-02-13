const actionTypes = {
  FETCH_EXPERIMENTS: 'C_FETCH_EXPERIMENTS',
  FETCH_EXPERIMENTS_SUCCESS: 'C_FETCH_EXPERIMENTS_SUCCESS',
  FETCH_EXPERIMENTS_ERROR: 'C_FETCH_EXPERIMENTS_ERROR'
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
  }
};

export {actionTypes, actions};
