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
    default:
      return state;
  }
};

export default combineReducers({
  list: reducer,
  form: getReducer(scopes.REPORTS, {
    id: undefined,
    requester_id: undefined,
    data: {
      name: '',
      consentUrl: '',
      consentFormat: FileFormats.PLAIN_TEXT,
      itemsUrl: '',
      filtersUrl: '',
      testsUrl: ''
    }
  })
});
