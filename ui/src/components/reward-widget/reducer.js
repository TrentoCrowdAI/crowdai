import {actionTypes} from './actions';

const defaultState = {
  reward: 0,
  loading: false,
  error: undefined
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.REQUEST_REWARD:
      return {
        ...state,
        loading: true
      };
    case actionTypes.REQUEST_REWARD_SUCCESS:
      return {
        ...state,
        loading: false,
        reward: action.reward
      };
    case actionTypes.REQUEST_REWARD_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    default:
      return state;
  }
};

export default reducer;
