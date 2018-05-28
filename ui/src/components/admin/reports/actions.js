import {getActionTypes, getActions} from 'src/utils/form';
import {scopes} from 'src/utils/constants';

const actionTypes = {
  FETCH_TTIME: 'C_FETCH_TTIME',
  FETCH_TTIME_SUCCESS: 'C_FETCH_TTIME_SUCCESS',
  FETCH_TTIME_ERROR: 'C_FETCH_TTIME_ERROR',
  FETCH_WTIME: 'C_FETCH_WTIME',
  FETCH_WTIME_SUCCESS: 'C_FETCH_WTIME_SUCCESS',
  FETCH_WTIME_ERROR: 'C_FETCH_WTIME_ERROR',
  FETCH_AGREEMENTS: 'C_FETCH_AGREEMENT',
  FETCH_AGREEMENTS_SUCCESS: 'C_FETCH_AGREEMENT_SUCCESS',
  FETCH_AGREEMENTS_ERROR: 'C_FETCH_AGREEMENT_ERROR',
  FETCH_WANSWERS: 'C_FETCH_WANSERS',
  FETCH_WANSWERS_SUCCESS: 'C_FETCH_WANSERS_SUCCESS',
  FETCH_WANSWERS_ERROR: 'C_FETCH_WANSERS_ERROR',
  FETCH_PERCENTAGE: 'C_FETCH_PERCENTAGE',
  FETCH_PERCENTAGE_SUCCESS: 'C_FETCH_PERCENTAGE_SUCCESS',
  FETCH_PERCENTAGE_ERROR: 'C_FETCH_PERCENTAGE_ERROR',
  FETCH_WORKERS: 'C_FETCH_WORKERS',
  FETCH_WORKERS_SUCCESS: 'C_FETCH_WORKERS_SUCCESS',
  FETCH_WORKERS_ERROR: 'C_FETCH_WORKERS_ERROR',
  FETCH_WAGREES: 'C_FETCH_WAGREES',
  FETCH_WAGREES_SUCCESS: 'C_FETCH_WAGREES_SUCCESS',
  FETCH_WAGREES_ERROR: 'C_FETCH_WAGREES_ERROR',
  FETCH_METRIC: 'C_FETCH_METRIC',
  FETCH_METRIC_SUCCESS: 'C_FETCH_METRIC_SUCCESS',
  FETCH_METRIC_ERROR: 'C_FETCH_METRIC_ERROR',
  ...getActionTypes(scopes.REPORTS)
};

const actions = {
  fetchTaskTime(jobId) {
    return {
      type: actionTypes.FETCH_TTIME,
      jobId
    };
  },
  fetchTaskTimeSuccess(response) {
    return {
      type: actionTypes.FETCH_TTIME_SUCCESS,
      response
    };
  },
  fetchTaskTimeError(error) {
    return {
      type: actionTypes.FETCH_TTIME_ERROR,
      error
    };
  },

  fetchWorkerTimes(jobId,workerId) {
    return {
      type: actionTypes.FETCH_WTIME,
      jobId,
      workerId
    };
  },
  fetchWorkerTimesSuccess(response) {
    return {
      type: actionTypes.FETCH_WTIME_SUCCESS,
      response
    };
  },
  fetchWorkerTimesError(error) {
    return {
      type: actionTypes.FETCH_WTIME_ERROR,
      error
    };
  },

  fetchTasksAgreements(jobId) {
    return {
      type: actionTypes.FETCH_AGREEMENTS,
      jobId
    };
  },
  fetchTasksAgreementsSuccess(response) {
    return {
      type: actionTypes.FETCH_AGREEMENTS_SUCCESS,
      response
    };
  },
  fetchTasksAgreementsError(error) {
    return {
      type: actionTypes.FETCH_AGREEMENTS_ERROR,
      error
    };
  },

  fetchWorkersAgreements(jobId,itemId,criteriaId) {
    return {
      type: actionTypes.FETCH_WAGREES,
      jobId,
      itemId,
      criteriaId
    };
  },
  fetchWorkersAgreementsSuccess(response) {
    return {
      type: actionTypes.FETCH_WAGREES_SUCCESS,
      response
    };
  },
  fetchWorkersAgreementsError(error) {
    return {
      type: actionTypes.FETCH_WAGREES_ERROR,
      error
    };
  },

  fetchAnswers(jobId,workerId) {
    return {
      type: actionTypes.FETCH_WANSWERS,
      jobId,
      workerId
    };
  },
  fetchAnswersSuccess(response) {
    return {
      type: actionTypes.FETCH_WANSWERS_SUCCESS,
      response
    };
  },
  fetchAnswersError(error) {
    return {
      type: actionTypes.FETCH_WANSWERS_ERROR,
      error
    };
  },

  fetchPercentage(jobId) {
    return {
      type: actionTypes.FETCH_PERCENTAGE,
      jobId
    };
  },
  fetchPercentageSuccess(response) {
    return {
      type: actionTypes.FETCH_PERCENTAGE_SUCCESS,
      response
    };
  },
  fetchPercentageError(error) {
    return {
      type: actionTypes.FETCH_PERCENTAGE_ERROR,
      error
    };
  },
  
  fetchWorkers(jobId) {
    return {
      type: actionTypes.FETCH_WORKERS,
      jobId
    };
  },
  fetchWorkersSuccess(response) {
    return {
      type: actionTypes.FETCH_WORKERS_SUCCESS,
      response
    };
  },
  fetchWorkersError(error) {
    return {
      type: actionTypes.FETCH_WORKERS_ERROR,
      error
    };
  },

  fetchMetric(jobId) {
    return {
      type: actionTypes.FETCH_METRIC,
      jobId
    };
  },
  fetchMetricSuccess(response) {
    return {
      type: actionTypes.FETCH_METRIC_SUCCESS,
      response
    };
  },
  fetchMetricError(error) {
    return {
      type: actionTypes.FETCH_METRIC_ERROR,
      error
    };
  },

  ...getActions(scopes.REPORTS),
};

export {actionTypes, actions};
