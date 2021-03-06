import {combineReducers} from 'redux';

import {actionTypes} from './actions';
import {getReducer} from 'src/utils/form';
import {scopes, JobStatus, FileFormats} from 'src/utils/constants';

const defaultState = {
  jobs: {
    rows: [],
    meta: {}
  },
  error: undefined,
  loading: false
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_JOBS:
      return {
        ...state,
        error: undefined,
        loading: true
      };
    case actionTypes.FETCH_JOBS_SUCCESS:
      return {
        ...state,
        jobs: action.response,
        loading: false
      };
    case actionTypes.FETCH_JOBS_ERROR:
      return {
        ...state,
        error: action.error,
        loading: false
      };
    default:
      return state;
  }
};

const genericFormReducer = getReducer(scopes.JOBS, {
  id: undefined,
  project_id: undefined,
  requester_id: undefined,
  uuid: '',
  data: {
    name: '',
    internalName: '',
    description: '',
    status: JobStatus.NOT_PUBLISHED,
    instructions: {},
    priors: {},
    consentUrl: '',
    consentFormat: FileFormats.PLAIN_TEXT,
    // True: ask each worker multiple criteria per paper. False: ask one criterion only per paper.
    multipleCriteria: false,
    criteriaQualityAnalysis: false,
    abstractPresentationTechnique: 'kh',
    labelOptions: 'ynk',
    hitConfig: {
      maxAssignments: 0, // if maxAssignments is > 0, then we limit the number of workers.
      lifetimeInMinutes: 7 * 24 * 60,
      assignmentDurationInMinutes: 20
    },
    // parameters
    maxTasksRule: 3,
    minTasksRule: 2,
    taskRewardRule: 0.1,
    testFrequencyRule: 2,
    initialTestsRule: 2,
    initialTestsMinCorrectAnswersRule: 100,
    votesPerTaskRule: 3,
    expertCostRule: 0.2,
    taskAssignmentStrategy: 0,
    aggregationStrategy: 0,
    // information related to the underlying project.
    itemsUrl: '',
    filtersUrl: '',
    testsUrl: ''
  },
  // when we fetch a job by its ID, in the criteria property
  // the API returns the list of criterion associated with the job.
  // When we create a job, after filling the filtersCSV this field
  // gets populated with the content of the CSV.
  criteria: [],
  criteriaLoading: false,
  criteriaError: undefined
});

// hacky way to get the whole state of the form
const defaultFormState = genericFormReducer(undefined, {});

const formReducer = (state = defaultFormState, action) => {
  switch (action.type) {
    case actionTypes.PUBLISH_JOB:
      return {
        ...state,
        error: undefined,
        loading: true
      };
    case actionTypes.PUBLISH_JOB_SUCCESS:
      return {
        ...state,
        item: {
          ...action.job
        },
        loading: false,
        saved: true
      };
    case actionTypes.PUBLISH_JOB_ERROR:
      return {
        ...state,
        error: action.error,
        loading: false
      };
    case actionTypes.FETCH_FILTERS_CSV:
      return {
        ...state,
        item: {
          ...state.item,
          criteria: [],
          criteriaError: undefined,
          criteriaLoading: true
        }
      };
    case actionTypes.FETCH_FILTERS_CSV_SUCCESS:
      return {
        ...state,
        item: {
          ...state.item,
          criteria: action.filters,
          criteriaLoading: false
        }
      };
    case actionTypes.FETCH_FILTERS_CSV_ERROR:
      return {
        ...state,
        item: {
          ...state.item,
          criteriaError: action.error,
          criteriaLoading: false
        }
      };
    case actionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.loading
      };
    default:
      return state;
  }
};

const defaultJobState = {
  item: {
    results: {}
  },
  error: undefined,
  loading: false,
  polling: false
};

const stateReducer = (state = defaultJobState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_JOB_STATE:
      return {
        ...state,
        loading: true,
        error: undefined
      };
    case actionTypes.FETCH_JOB_STATE_SUCCESS:
      return {
        ...state,
        loading: false,
        item: {
          ...action.state
        }
      };
    case actionTypes.FETCH_JOB_STATE_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    case actionTypes.FETCH_JOB_STATE_POLLED:
      return {
        ...state,
        polling: true
      };
    case actionTypes.FETCH_JOB_STATE_POLLED_DONE:
      return {
        ...state,
        polling: false
      };
    case actionTypes.CLEAN_JOB_STATE:
      return defaultJobState;
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
    case actionTypes.COPY_JOB:
      return {
        ...state,
        item: {},
        loading: true,
        error: undefined
      };
    case actionTypes.COPY_JOB_SUCCESS:
      return {
        ...state,
        loading: false,
        item: action.copiedJob
      };
    case actionTypes.COPY_JOB_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    default:
      return state;
  }
};

const defaultTaskAssignmentStrategiesState = {
  strategies: [],
  error: undefined
};

const taskAssignmentStrategiesReducer = (state = defaultTaskAssignmentStrategiesState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_TASK_ASSIGNMENT_STRATEGIES:
      return {...defaultTaskAssignmentStrategiesState};
    case actionTypes.FETCH_TASK_ASSIGNMENT_STRATEGIES_SUCCESS:
      return {
        ...state,
        strategies: action.taskAssignmentStrategies
      };
    case actionTypes.FETCH_TASK_ASSIGNMENT_STRATEGIES_ERROR:
      return {
        ...state,
        error: action.error
      };
    default:
      return state;
  }
};

const defaultResultsState = {
  results: {rows: []},
  error: undefined,
  loading: false
};

const resultsReducer = (state = defaultResultsState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_RESULTS:
      return {...state, error: undefined, loading: true};
    case actionTypes.FETCH_RESULTS_SUCCESS:
      return {
        ...state,
        loading: false,
        results: action.results
      };
    case actionTypes.FETCH_RESULTS_ERROR:
      return {
        ...state,
        error: action.error,
        loading: false
      };
    case actionTypes.CLEAN_RESULTS:
      return {
        ...defaultResultsState
      };
    default:
      return state;
  }
};

const defaultAggregationStrategiesState = {
  strategies: [],
  error: undefined
};

const aggregationStrategiesReducer = (state = defaultAggregationStrategiesState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_AGGREGATION_STRATEGIES:
      return {...defaultAggregationStrategiesState};
    case actionTypes.FETCH_AGGREGATION_STRATEGIES_SUCCESS:
      return {
        ...state,
        strategies: action.aggregationStrategies
      };
    case actionTypes.FETCH_AGGREGATION_STRATEGIES_ERROR:
      return {
        ...state,
        error: action.error
      };
    default:
      return state;
  }
};

const defaultSelectedParameterState = {
  selected: undefined
};

const selectedParameterReducer = (state = defaultSelectedParameterState, action) => {
  switch (action.type) {
    case actionTypes.SET_SELECTED_PARAMETER:
      return {
        selected: action.parameter
      };
    default:
      return state;
  }
};

const defaultJobEstimationsState = {
  // an map of jobId to estimation object ... jobId => {token: <string>, estimation: <object>, status: <string>}
  estimations: {},
  loading: false,
  error: undefined,
  polling: false
};

const jobEstimationsReducer = (state = defaultJobEstimationsState, action) => {
  switch (action.type) {
    case actionTypes.COMPUTE_JOB_ESTIMATIONS:
      return {
        ...state,
        loading: true
      };
    case actionTypes.COMPUTE_JOB_ESTIMATIONS_SUCCESS:
      return {
        ...state,
        estimations: {
          ...state.estimations,
          [action.jobId]: action.response
        },
        loading: false
      };
    case actionTypes.COMPUTE_JOB_ESTIMATIONS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    case actionTypes.FETCH_JOB_ESTIMATIONS_STATUS:
      return {
        ...state,
        loading: true
      };
    case actionTypes.FETCH_JOB_ESTIMATIONS_STATUS_SUCCESS:
      return {
        ...state,
        loading: false,
        estimations: {
          ...state.estimations,
          [action.jobId]: {
            ...state.estimations[action.jobId], // {token: <string>}
            ...action.response // {status: <string>}
          }
        }
      };
    case actionTypes.FETCH_JOB_ESTIMATIONS_STATUS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    case actionTypes.CHECK_JOB_ESTIMATIONS_STATUS_POLLED:
      return {
        ...state,
        polling: true
      };
    case actionTypes.CHECK_JOB_ESTIMATIONS_STATUS_POLLED_DONE:
      return {
        ...state,
        polling: false
      };
    default:
      return state;
  }
};

export default combineReducers({
  list: reducer,
  // finally we combine generic and formReducer that handles
  // jobs creation and publishing
  form: (state = defaultFormState, action) => {
    let outputState = genericFormReducer(state, action);
    return formReducer(outputState, action);
  },
  state: stateReducer,
  copy: copyReducer,
  taskAssignmentStrategies: taskAssignmentStrategiesReducer,
  results: resultsReducer,
  aggregationStrategies: aggregationStrategiesReducer,
  selectedParameter: selectedParameterReducer,
  jobEstimations: jobEstimationsReducer
});
