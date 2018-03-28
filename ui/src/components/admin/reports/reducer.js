import {combineReducers} from 'redux';

import {actionTypes} from './actions';
import {getReducer} from 'src/utils/form';
import {scopes, FileFormats} from 'src/utils/constants';

const defaultState = {
  reports: {
    rows: [],
    meta: {}
  },
  error: undefined,
  loading: false
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_REPORTS:
      return {
        ...state,
        error: undefined,
        loading: true
      };
    case actionTypes.FETCH_REPORTS_SUCCESS:
      return {
        ...state,
        reports: action.response,
        loading: false
      };
    case actionTypes.FETCH_REPORTS_ERROR:
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
