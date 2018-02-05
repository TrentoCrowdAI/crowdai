const actionTypes = {
  REQUEST_REWARD: 'RW_REQUEST_REWARD',
  REQUEST_REWARD_SUCCESS: 'RW_REQUEST_REWARD_SUCCESS',
  REQUEST_REWARD_ERROR: 'RW_REQUEST_REWARD_ERROR'
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
