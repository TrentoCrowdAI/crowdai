import {getActionTypes, getActions} from 'src/utils/form';
import {scopes} from 'src/utils/constants';

const actionTypes = {
  FETCH_TTIME: 'C_FETCH_TTIME',
  FETCH_TTIME_SUCCESS: 'C_FETCH_TTIME_SUCCESS',
  FETCH_TTIME_ERROR: 'C_FETCH_TTIME_ERROR',
  FETCH_WTIME: 'C_FETCH_WTIME',
  FETCH_WTIME_SUCCESS: 'C_FETCH_WTIME_SUCCESS',
  FETCH_WTIME_ERROR: 'C_FETCH_WTIME_ERROR',
  FETCH_AGREEMENT: 'C_FETCH_AGREEMENT',
  FETCH_AGREEMENT_SUCCESS: 'C_FETCH_AGREEMENT_SUCCESS',
  FETCH_AGREEMENT_ERROR: 'C_FETCH_AGREEMENT_ERROR',
  FETCH_WANSWERS: 'C_FETCH_WANSERS',
  FETCH_WANSWERS_SUCCESS: 'C_FETCH_WANSERS_SUCCESS',
  FETCH_WANSWERS_ERROR: 'C_FETCH_WANSERS_ERROR',
  FETCH_PERCENTAGE: 'C_FETCH_PERCENTAGE',
  FETCH_PERCENTAGE_SUCCESS: 'C_FETCH_PERCENTAGE_SUCCESS',
  FETCH_PERCENTAGE_ERROR: 'C_FETCH_PERCENTAGE_ERROR',
  FETCH_WORKERS: 'C_FETCH_WORKERS',
  FETCH_WORKERS_SUCCESS: 'C_FETCH_WORKERS_SUCCESS',
  FETCH_WORKERS_ERROR: 'C_FETCH_WORKERS_ERROR',
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

  fetchAgreement(jobId) {
    return {
      type: actionTypes.FETCH_AGREEMENT,
      jobId
    };
  },
  fetchAgreementSuccess(response) {
    return {
      type: actionTypes.FETCH_AGREEMENT_SUCCESS,
      response
    };
  },
  fetchAgreementError(error) {
    return {
      type: actionTypes.FETCH_AGREEMENT_ERROR,
      error
    };
  },

  fetchAnswers(workerId) {
    return {
      type: actionTypes.FETCH_WANSWERS,
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

  ...getActions(scopes.REPORTS),
};

export {actionTypes, actions};
