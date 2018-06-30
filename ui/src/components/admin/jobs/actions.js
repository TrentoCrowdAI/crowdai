import {getActionTypes, getActions} from 'src/utils/form';
import {scopes} from 'src/utils/constants';

const actionTypes = {
  FETCH_JOBS: 'C_FETCH_JOBS',
  FETCH_JOBS_SUCCESS: 'C_FETCH_JOBS_SUCCESS',
  FETCH_JOBS_ERROR: 'C_FETCH_JOBS_ERROR',
  PUBLISH_JOB: 'C_PUBLISH_JOB',
  PUBLISH_JOB_SUCCESS: 'C_PUBLISH_JOB_SUCCESS',
  PUBLISH_JOB_ERROR: 'C_PUBLISH_JOB_ERROR',
  FETCH_JOB_STATE: 'C_FETCH_JOB_STATE',
  FETCH_JOB_STATE_SUCCESS: 'C_FETCH_JOB_STATE_SUCCESS',
  FETCH_JOB_STATE_ERROR: 'C_FETCH_JOB_STATE_ERROR',
  FETCH_JOB_STATE_POLLED: 'C_FETCH_JOB_STATE_POLLED',
  FETCH_JOB_STATE_POLLED_DONE: 'C_FETCH_JOB_STATE_POLLED_DONE',
  CLEAN_JOB_STATE: 'C_CLEAN_JOB_STATE',
  COPY_JOB: 'C_COPY_JOB',
  COPY_JOB_SUCCESS: 'C_COPY_JOB_SUCCESS',
  COPY_JOB_ERROR: 'C_COPY_JOB_ERROR',
  CHECK_CSV_CREATION: 'C_CHECK_CSV_CREATION',
  CHECK_CSV_CREATION_SUCCESS: 'C_CHECK_CSV_CREATION_SUCCESS',
  CHECK_CSV_CREATION_ERROR: 'C_CHECK_CSV_CREATION_ERROR',
  CHECK_CSV_CREATION_DONE: 'C_CHECK_CSV_CREATION_DONE',
  FETCH_FILTERS_CSV: 'C_FETCH_FILTERS_CSV',
  FETCH_FILTERS_CSV_SUCCESS: 'C_FETCH_FILTERS_CSV_SUCCESS',
  FETCH_FILTERS_CSV_ERROR: 'C_FETCH_FILTERS_CSV_ERROR',
  SET_LOADING: 'C_SET_LOADING',
  FETCH_TASK_ASSIGNMENT_STRATEGIES: 'C_FETCH_TASK_ASSIGNMENT_STRATEGIES',
  FETCH_TASK_ASSIGNMENT_STRATEGIES_SUCCESS: 'C_FETCH_TASK_ASSIGNMENT_STRATEGIES_SUCCESS',
  FETCH_TASK_ASSIGNMENT_STRATEGIES_ERROR: 'C_FETCH_TASK_ASSIGNMENT_STRATEGIES_ERROR',
  FETCH_RESULTS: 'C_FETCH_RESULTS',
  CLEAN_RESULTS: 'C_CLEAN_RESULTS',
  FETCH_RESULTS_SUCCESS: 'C_FETCH_RESULTS_SUCCESS',
  FETCH_RESULTS_ERROR: 'C_FETCH_RESULTS_ERROR',
  FETCH_AGGREGATION_STRATEGIES: 'C_FETCH_AGGREGATION_STRATEGIES',
  FETCH_AGGREGATION_STRATEGIES_SUCCESS: 'C_FETCH_AGGREGATION_STRATEGIES_SUCCESS',
  FETCH_AGGREGATION_STRATEGIES_ERROR: 'C_FETCH_AGGREGATION_STRATEGIES_ERROR',
  SET_SELECTED_PARAMETER: 'C_SET_SELECTED_PARAMETER',

  COMPUTE_JOB_ESTIMATIONS: 'C_COMPUTE_JOB_ESTIMATIONS',
  COMPUTE_JOB_ESTIMATIONS_SUCCESS: 'C_COMPUTE_JOB_ESTIMATIONS_SUCCESS',
  COMPUTE_JOB_ESTIMATIONS_ERROR: 'C_COMPUTE_JOB_ESTIMATIONS_ERROR',
  CHECK_JOB_ESTIMATIONS_STATUS_POLLED: 'C_CHECK_JOB_ESTIMATIONS_STATUS_POLLED',
  CHECK_JOB_ESTIMATIONS_STATUS_POLLED_DONE: 'C_CHECK_JOB_ESTIMATIONS_STATUS_POLLED_DONE',
  FETCH_JOB_ESTIMATIONS_STATUS: 'C_FETCH_JOB_ESTIMATIONS_STATUS',
  FETCH_JOB_ESTIMATIONS_STATUS_SUCCESS: 'C_FETCH_JOB_ESTIMATIONS_STATUS_SUCCESS',
  FETCH_JOB_ESTIMATIONS_STATUS_ERROR: 'C_FETCH_JOB_ESTIMATIONS_STATUS_ERROR',
  ...getActionTypes(scopes.JOBS)
};

const actions = {
  fetchJobs(projectId) {
    return {
      type: actionTypes.FETCH_JOBS,
      projectId
    };
  },

  fetchJobsSuccess(response) {
    return {
      type: actionTypes.FETCH_JOBS_SUCCESS,
      response
    };
  },

  fetchJobsError(error) {
    return {
      type: actionTypes.FETCH_JOBS_ERROR,
      error
    };
  },

  publish() {
    return {
      type: actionTypes.PUBLISH_JOB
    };
  },

  publishSuccess(job) {
    return {
      type: actionTypes.PUBLISH_JOB_SUCCESS,
      job
    };
  },

  publishError(error) {
    return {
      type: actionTypes.PUBLISH_JOB_ERROR,
      error
    };
  },

  ...getActions(scopes.JOBS),

  /**
   * We override the submit action creator to add the redirect boolean flag.
   *
   * @param {Boolean} redirect
   * @param {Function} onSuccessExtraAction - additional action to dispatch onSuccess
   * @return {Object}
   */
  submit(redirect = true, onSuccessExtraAction) {
    return {
      type: actionTypes.SUBMIT,
      redirect,
      onSuccessExtraAction
    };
  },

  fetchItem(id, isWorker = false) {
    return {
      type: actionTypes.FETCH_ITEM,
      id,
      isWorker
    };
  },

  cleanJobState() {
    return {
      type: actionTypes.CLEAN_JOB_STATE
    };
  },

  fetchJobState(id) {
    return {
      type: actionTypes.FETCH_JOB_STATE,
      id
    };
  },

  fetchJobStateSuccess(state) {
    return {
      type: actionTypes.FETCH_JOB_STATE_SUCCESS,
      state
    };
  },

  fetchJobStateError(error) {
    return {
      type: actionTypes.FETCH_JOB_STATE_ERROR,
      error
    };
  },

  pollJobState(id) {
    return {
      type: actionTypes.FETCH_JOB_STATE_POLLED,
      id
    };
  },

  pollJobStateDone() {
    return {
      type: actionTypes.FETCH_JOB_STATE_POLLED_DONE
    };
  },

  copyJob(id) {
    return {
      type: actionTypes.COPY_JOB,
      id
    };
  },

  copyJobSuccess(copiedJob) {
    return {
      type: actionTypes.COPY_JOB_SUCCESS,
      copiedJob
    };
  },

  copyJobError(error) {
    return {
      type: actionTypes.COPY_JOB_ERROR,
      error
    };
  },

  /**
   * This action triggers the polling to check the creation status of the CSV files
   * associated with the job.
   *
   * @param {Number} job
   * @return {Object}
   */
  checkCSVCreation(job) {
    return {
      type: actionTypes.CHECK_CSV_CREATION,
      job
    };
  },

  checkCSVCreationSuccess(status) {
    return {
      type: actionTypes.CHECK_CSV_CREATION_SUCCESS,
      status
    };
  },

  checkCSVCreationError(error) {
    return {
      type: actionTypes.CHECK_CSV_CREATION_ERROR,
      error
    };
  },

  checkCSVCreationDone() {
    return {
      type: actionTypes.CHECK_CSV_CREATION_DONE
    };
  },

  fetchFiltersCSV(url) {
    return {
      type: actionTypes.FETCH_FILTERS_CSV,
      url
    };
  },

  fetchFiltersCSVSuccess(filters) {
    return {
      type: actionTypes.FETCH_FILTERS_CSV_SUCCESS,
      filters
    };
  },

  fetchFiltersCSVError(error) {
    return {
      type: actionTypes.FETCH_FILTERS_CSV_ERROR,
      error
    };
  },

  setLoading(loading) {
    return {
      type: actionTypes.SET_LOADING,
      loading
    };
  },

  fetchTaskAssignmentStrategies() {
    return {
      type: actionTypes.FETCH_TASK_ASSIGNMENT_STRATEGIES
    };
  },

  fetchTaskAssignmentStrategiesSuccess(taskAssignmentStrategies) {
    return {
      type: actionTypes.FETCH_TASK_ASSIGNMENT_STRATEGIES_SUCCESS,
      taskAssignmentStrategies
    };
  },

  fetchTaskAssignmentStrategiesError(error) {
    return {
      type: actionTypes.FETCH_TASK_ASSIGNMENT_STRATEGIES_ERROR,
      error
    };
  },

  fetchResults(jobId, page = 1) {
    return {
      type: actionTypes.FETCH_RESULTS,
      jobId,
      page
    };
  },

  fetchResultsSuccess(results) {
    return {
      type: actionTypes.FETCH_RESULTS_SUCCESS,
      results
    };
  },

  fetchResultsError(error) {
    return {
      type: actionTypes.FETCH_RESULTS_ERROR,
      error
    };
  },

  cleanResults(jobId) {
    return {
      type: actionTypes.CLEAN_RESULTS,
      jobId
    };
  },

  fetchAggregationStrategies() {
    return {
      type: actionTypes.FETCH_AGGREGATION_STRATEGIES
    };
  },

  fetchAggregationStrategiesSuccess(aggregationStrategies) {
    return {
      type: actionTypes.FETCH_AGGREGATION_STRATEGIES_SUCCESS,
      aggregationStrategies
    };
  },

  fetchAggregationStrategiesError(error) {
    return {
      type: actionTypes.FETCH_AGGREGATION_STRATEGIES_ERROR,
      error
    };
  },

  /**
   * Sets the current selected parameters based on the point clicked in PriceLossChart.
   *
   * @param {Object} parameter
   * @return {Object}
   */
  setSelectedParameter(parameter) {
    return {
      type: actionTypes.SET_SELECTED_PARAMETER,
      parameter
    };
  },

  computeJobEstimations(jobId, single, onSuccessAction) {
    return {
      type: actionTypes.COMPUTE_JOB_ESTIMATIONS,
      jobId,
      single,
      onSuccessAction // a function that should return an action to trigger on success.
    };
  },

  computeJobEstimationsSuccess(jobId, response) {
    return {
      type: actionTypes.COMPUTE_JOB_ESTIMATIONS_SUCCESS,
      jobId,
      response
    };
  },

  computeJobEstimationsError(error) {
    return {
      type: actionTypes.COMPUTE_JOB_ESTIMATIONS_ERROR,
      error
    };
  },

  fetchJobEstimationsStatus(jobId) {
    return {
      type: actionTypes.FETCH_JOB_ESTIMATIONS_STATUS,
      jobId
    };
  },

  fetchJobEstimationsStatusSuccess(jobId, response) {
    return {
      type: actionTypes.FETCH_JOB_ESTIMATIONS_STATUS_SUCCESS,
      jobId,
      response
    };
  },

  fetchJobEstimationsStatusError(error) {
    return {
      type: actionTypes.FETCH_JOB_ESTIMATIONS_STATUS_ERROR,
      error
    };
  },

  pollJobEstimationsStatus(jobId) {
    return {
      type: actionTypes.CHECK_JOB_ESTIMATIONS_STATUS_POLLED,
      jobId
    };
  },

  pollJobEstimationsStatusDone(jobId) {
    return {
      type: actionTypes.CHECK_JOB_ESTIMATIONS_STATUS_POLLED_DONE,
      jobId
    };
  }
};

export {actionTypes, actions};
