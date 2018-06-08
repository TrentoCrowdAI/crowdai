const actionTypes = {
  ASSIGN_FILTERS: 'C_ASSIGN_FILTERS',
  GENERATE_BASELINE: 'C_GENERATE_BASELINE'
};

const actions = {
  assignFilters(jobId) {
    return {
      type: actionTypes.ASSIGN_FILTERS,
      jobId
    };
  },

  generateBaseline(jobId) {
    return {
      type: actionTypes.GENERATE_BASELINE,
      jobId
    };
  }
};

export {actionTypes, actions};
