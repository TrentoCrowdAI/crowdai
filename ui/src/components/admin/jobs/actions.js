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
  }
};

export {actionTypes, actions};
