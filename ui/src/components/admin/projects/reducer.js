import {combineReducers} from 'redux';

import {actionTypes} from './actions';
import {getReducer} from 'src/utils/form';
import {scopes, FileFormats} from 'src/utils/constants';

const defaultState = {
  projects: {
    rows: [],
    meta: {}
  },
  error: undefined,
  loading: false
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_PROJECTS:
      return {
        ...state,
        error: undefined,
        loading: true
      };
    case actionTypes.FETCH_PROJECTS_SUCCESS:
      return {
        ...state,
        projects: action.response,
        loading: false
      };
    case actionTypes.FETCH_PROJECTS_ERROR:
      return {
        ...state,
        error: action.error,
        loading: false
      };
    default:
      return state;
  }
};

const defaultCopyState = {
  item: {},
  error: undefined,
  loading: false
};

const copyReducer = (state = defaultCopyState, action) => {
  switch (action.type) {
    case actionTypes.COPY_PROJECT:
      return {
        ...state,
        item: {},
        loading: true,
        error: undefined
      };
    case actionTypes.COPY_PROJECT_SUCCESS:
      return {
        ...state,
        loading: false,
        item: action.copiedProject
      };
    case actionTypes.COPY_PROJECT_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    default:
      return state;
  }
};

export default combineReducers({
  list: reducer,
  form: getReducer(scopes.PROJECTS, {
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
  }),
  copy: copyReducer
});
