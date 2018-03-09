import {combineReducers} from 'redux';

import {actionTypes} from './actions';
import {getReducer} from 'src/utils/form';
import {scopes, FileFormats, ExperimentStatus} from 'src/utils/constants';

const defaultState = {
  experiments: {
    rows: [],
    meta: {}
  },
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
        experiments: action.response,
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

const genericFormReducer = getReducer(scopes.EXPERIMENTS, {
  id: undefined,
  project_id: undefined,
  uuid: '',
  data: {
    name: '',
    requesterId: '',
    status: ExperimentStatus.NOT_PUBLISHED,
    taskInstructionsUrl: '',
    taskInstructionsFormat: FileFormats.PLAIN_TEXT,
    // True: ask each worker multiple criteria per paper. False: ask one criterion only per paper.
    multipleCriteria: false,
    criteriaQualityAnalysis: false,
    abstractPresentationTechnique: 'kh',
    labelOptions: 'ynk',
    // HIT configurations
    maxAssignments: 10,
    assignmentDurationInSeconds: 600,
    description: '',
    lifetimeInSeconds: 5 * 60 * 60,
    // parameters
    maxTasksRule: 3,
    taskRewardRule: 0.5,
    testFrequencyRule: 2,
    initialTestsRule: 2,
    initialTestsMinCorrectAnswersRule: 100,
    votesPerTaskRule: 2,
    expertCostRule: 0.2,
    crowdsourcingStrategy: 'baseline'
  }
});

// hacky way to get the whole state of the form
const defaultFormState = genericFormReducer(undefined, {});

const formReducer = (state = defaultFormState, action) => {
  switch (action.type) {
    case actionTypes.PUBLISH_EXPERIMENT:
      return {
        ...state,
        item: {
          ...state.item,
          status: ExperimentStatus.NOT_PUBLISHED
        },
        error: undefined,
        loading: true
      };
    case actionTypes.PUBLISH_EXPERIMENT_SUCCESS:
      return {
        ...state,
        item: {
          ...state.item,
          status: ExperimentStatus.PUBLISHED
        },
        loading: false
      };
    case actionTypes.PUBLISH_EXPERIMENT_ERROR:
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
  // finally we combine generic and formReducer that handles
  // experiments creation and publishing
  form: (state = defaultFormState, action) => {
    let outputState = genericFormReducer(state, action);
    return formReducer(outputState, action);
  }
});
