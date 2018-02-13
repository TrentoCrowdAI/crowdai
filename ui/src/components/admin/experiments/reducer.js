import {actionTypes} from './actions';

const defaultState = {
  experiments: [],
  error: undefined,
  loading: false
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_EXPERIMENTS:
      return {
        ...state,
        error: undefined,
        loading: true
      };
    case actionTypes.FETCH_EXPERIMENTS_SUCCESS:
      return {
        ...state,
        experiments: action.response.experiments,
        loading: false
      };
    case actionTypes.FETCH_EXPERIMENTS_ERROR:
      return {
        ...state,
        error: action.error,
        loading: false
      };
    default:
      return state;
  }
};

export default reducer;
