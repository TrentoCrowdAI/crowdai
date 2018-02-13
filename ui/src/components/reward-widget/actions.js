const actionTypes = {
  REQUEST_REWARD: 'C_REQUEST_REWARD',
  REQUEST_REWARD_SUCCESS: 'C_REQUEST_REWARD_SUCCESS',
  REQUEST_REWARD_ERROR: 'C_REQUEST_REWARD_ERROR'
};

const actions = {
  requestReward() {
    return {
      type: actionTypes.REQUEST_REWARD
    };
  },

  requestRewardSuccess(reward) {
    return {
      type: actionTypes.REQUEST_REWARD_SUCCESS,
      reward
    };
  },

  requestRewardError(error) {
    return {
      type: actionTypes.REQUEST_REWARD_ERROR,
      error
    };
  }
};

export {actionTypes, actions};
