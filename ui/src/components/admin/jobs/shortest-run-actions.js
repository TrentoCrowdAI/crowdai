const actionTypes = {
  ASSIGN_FILTERS: 'C_ASSIGN_FILTERS'
};

const actions = {
  assignFilters(jobId) {
    return {
      type: actionTypes.ASSIGN_FILTERS,
      jobId
    };
  }
};

export {actionTypes, actions};
