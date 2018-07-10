import {getActionTypes, getActions} from 'src/utils/form';
import {scopes} from 'src/utils/constants';

const actionTypes = {
  FETCH_TTIME: 'C_FETCH_TTIME',
  FETCH_TTIME_SUCCESS: 'C_FETCH_TTIME_SUCCESS',
  FETCH_TTIME_ERROR: 'C_FETCH_TTIME_ERROR',
  FETCH_AGREEMENTS: 'C_FETCH_AGREEMENT',
  FETCH_AGREEMENTS_SUCCESS: 'C_FETCH_AGREEMENT_SUCCESS',
  FETCH_AGREEMENTS_ERROR: 'C_FETCH_AGREEMENT_ERROR',
  FETCH_WORKERS: 'C_FETCH_WORKERS',
  FETCH_WORKERS_SUCCESS: 'C_FETCH_WORKERS_SUCCESS',
  FETCH_WORKERS_ERROR: 'C_FETCH_WORKERS_ERROR',
  FETCH_CROWDGOLDS: 'C_FETCH_CROWDGOLDS',
  FETCH_CROWDGOLDS_SUCCESS:'C_FETCH_CROWDGOLDS_SUCCESS',
  FETCH_CROWDGOLDS_ERROR: 'C_FETCH_CROWDGOLDS_ERROR',
  FETCH_PAIRS: 'C_FETCH_PAIRS',
  FETCH_PAIRS_SUCCESS: 'C_FETCH_PAIRS_SUCCESS',
  FETCH_PAIRS_ERROR: 'C_FETCH_PAIRS_ERROR',
  FETCH_SINGLE: 'C_FETCH_SINGLE',
  FETCH_SINGLE_SUCCESS: 'C_FETCH_SINGLE_SUCCESS',
  FETCH_SINGLE_ERROR: 'C_FETCH_SINGLE_ERROR',
  FETCH_CONTRIBUTION: 'C_FETCH_CONTRIBUTION',
  FETCH_CONTRIBUTION_SUCCESS: 'C_FETCH_CONTRIBUTION_SUCCESS',
  FETCH_CONTRIBUTION_ERROR: 'C_FETCH_CONTRIBUTION_ERROR',
  FETCH_GLOBAL: 'C_FETCH_GLOBAL',
  FETCH_GLOBAL_SUCCESS: 'C_FETCH_GLOBAL_SUCCESS',
  FETCH_GLOBAL_ERROR: 'C_FETCH_GLOBAL_ERROR',
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

  fetchCrowdGolds(jobId) {
    return {
      type: actionTypes.FETCH_CROWDGOLDS,
      jobId
    };
  },
  fetchCrowdGoldsSuccess(response) {
    return {
      type: actionTypes.FETCH_CROWDGOLDS_SUCCESS,
      response
    };
  },
  fetchCrowdGoldsError(error) {
    return {
      type: actionTypes.FETCH_CROWDGOLDS_ERROR,
      error
    };
  },

  fetchWorkersPairs(jobId) {
    return {
      type: actionTypes.FETCH_PAIRS,
      jobId
    };
  },
  fetchWorkersPairsSuccess(response) {
    return {
      type: actionTypes.FETCH_PAIRS_SUCCESS,
      response
    };
  },
  fetchWorkersPairsError(error) {
    return {
      type: actionTypes.FETCH_PAIRS_ERROR,
      error
    };
  },

  fetchSingleWorker(jobId,workerId) {
    return {
      type: actionTypes.FETCH_SINGLE,
      jobId,
      workerId
    };
  },
  fetchSingleWorkerSuccess(response) {
    return {
      type: actionTypes.FETCH_SINGLE_SUCCESS,
      response
    };
  },
  fetchSingleWorkerError(error) {
    return {
      type: actionTypes.FETCH_SINGLE_ERROR,
      error
    };
  },

  fetchContribution(jobId) {
    return {
      type: actionTypes.FETCH_CONTRIBUTION,
      jobId
    };
  },
  fetchContributionSuccess(response) {
    return {
      type: actionTypes.FETCH_CONTRIBUTION_SUCCESS,
      response
    };
  },
  fetchContributionError(error) {
    return {
      type: actionTypes.FETCH_CONTRIBUTION_ERROR,
      error
    };
  },

  fetchJobStats(jobId) {
    return {
      type: actionTypes.FETCH_GLOBAL,
      jobId
    };
  },
  fetchJobStatsSuccess(response) {
    return {
      type: actionTypes.FETCH_GLOBAL_SUCCESS,
      response
    };
  },
  fetchJobStatsError(error) {
    return {
      type: actionTypes.FETCH_GLOBAL_ERROR,
      error
    };
  },


  ...getActions(scopes.REPORTS),
};

export {actionTypes, actions};
