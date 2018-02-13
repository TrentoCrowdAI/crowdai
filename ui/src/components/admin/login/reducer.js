import {actionTypes} from './actions';

const defaultState = {
  loginInfo: {},
  loggedIn: false,
  error: undefined,
  loading: false
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.VERIFY_GOOGLE_TOKEN:
      return {
        ...state,
        loggedIn: false,
        loading: true
      };
    case actionTypes.VERIFY_GOOGLE_TOKEN_SUCCESS:
      return {
        ...state,
        loggedIn: true,
        loading: false,
        loginInfo: action.loginInfo
      };
    case actionTypes.VERIFY_GOOGLE_TOKEN_ERROR:
      return {
        ...state,
        loggedIn: false,
        error: action.error,
        loading: false
      };
    default:
      return state;
  }
};

export default reducer;
