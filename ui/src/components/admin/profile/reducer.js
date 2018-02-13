import {actionTypes} from './actions';

const defaultState = {
  profile: {
    email: '',
    name: '',
    givenName: '',
    familyName: ''
  },
  error: undefined,
  loading: false,
  saved: false
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_PROFILE:
      return {
        ...state,
        error: undefined,
        loading: true,
        saved: false
      };
    case actionTypes.FETCH_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        profile: action.profile
      };
    case actionTypes.FETCH_PROFILE_ERROR:
      return {
        ...state,
        error: action.error,
        loading: false
      };
    case actionTypes.SUBMIT:
      return {
        ...state,
        loading: true,
        error: undefined,
        saved: false
      };
    case actionTypes.SUBMIT_SUCCESS:
      return {
        ...state,
        loading: false,
        saved: true
      };
    case actionTypes.SUBMIT_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    case actionTypes.SET_INPUT_VALUE:
      return {
        ...state,
        profile: {
          ...state.profile,
          [action.name]: action.value
        }
      };
    default:
      return state;
  }
};

export default reducer;
