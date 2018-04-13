import {combineReducers} from 'redux';

import {getReducer} from 'src/utils/form';
import {scopes, FileFormats} from 'src/utils/constants';
import {actionTypes} from './actions';

const defaultState = {
  reports: {
    tasks: []
  },
  error: undefined,
  loading: false
};

const wdefaultState = {
  workers: {
    workers: []
  },
  error: undefined,
  loading: false
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_TTIME:
      return {
        ...state,
        error: undefined,
        loading: true
      };
    case actionTypes.FETCH_TTIME_SUCCESS:
      return {
        ...state,
        reports: action.response,
        loading: false
      };
    case actionTypes.FETCH_TTIME_ERROR:
      return {
        ...state,
        error: action.error,
        loading: false
      };

    case actionTypes.FETCH_WTIME:
      return {
        ...state,
        error: undefined,
        loading: true
      };
    case actionTypes.FETCH_WTIME_SUCCESS:
      return {
        ...state,
        reports: action.response,
        loading: false
      };
    case actionTypes.FETCH_WTIME_ERROR:
      return {
        ...state,
        error: action.error,
        loading: false
      };
    default:
      return state;
  }
};

const wreducer = (state = wdefaultState, action) => {
  switch(action.type) {
    case actionTypes.FETCH_WORKERS:
      return {
        ...state,
        error: undefined,
        loading: true
      };
    case actionTypes.FETCH_WORKERS_SUCCESS:
      return {
        ...state,
        workers: action.response,
        loading: false
      };
    case actionTypes.FETCH_WORKERS_ERROR:
      return {
        ...state,
        error: action.error,
        loading: false
      };
    default:
      return state;
  }
};

export default combineReducers({
  list: reducer,
  wlist: wreducer
});
