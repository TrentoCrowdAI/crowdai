import {Observable} from 'rxjs';
import {combineEpics} from 'redux-observable';

import {actionTypes, actions} from './actions';
import {requestersApi} from 'src/utils/axios';
import {flattenError} from 'src/utils';

const getTaskTime = (action$, store) =>
  action$.ofType(actionTypes.FETCH_TTIME).switchMap(action => {
    return Observable.defer(() => requestersApi.get('getAllTasksTimesByJob/'+action.jobId))
      .mergeMap(response => Observable.of(actions.fetchTaskTimeSuccess(response.data)))
      .catch(error => Observable.of(actions.fetchTaskTimeError(flattenError(error))));
});
const fetchTaskTime = (action$, store) =>
  action$.ofType(actionTypes.FETCH_ITEM).switchMap(action => {
    return Observable.defer(
      () => requestersApi.get(`getAllTasksTimesByJob/`+action.jobId))
    .mergeMap(response => Observable.of(actions.fetchItemSuccess(response.data)))
    .catch(error => Observable.of(actions.fetchItemError(flattenError(error))));
});

const getTasksAgreements = (action$, store) =>
  action$.ofType(actionTypes.FETCH_AGREEMENTS).switchMap(action => {
    return Observable.defer(() => requestersApi.get('getTasksAgreements/'+action.jobId))
      .mergeMap(response => Observable.of(actions.fetchTasksAgreementsSuccess(response.data)))
      .catch(error => Observable.of(actions.fetchTasksAgreementsError(flattenError(error))));
});
const fetchTasksAgreements = (action$, store) =>
  action$.ofType(actionTypes.FETCH_ITEM).switchMap(action => {
    return Observable.defer(() => requestersApi.get(`getTasksAgreements/`+action.jobId))
      .mergeMap(response => Observable.of(actions.fetchItemSuccess(response.data)))
      .catch(error => Observable.of(actions.fetchItemError(flattenError(error))));
});

const getCrowdGolds = (action$, store) =>
  action$.ofType(actionTypes.FETCH_CROWDGOLDS).switchMap(action => {
    return Observable.defer(() => requestersApi.get('getCrowdGolds/'+action.jobId))
      .mergeMap(response => Observable.of(actions.fetchCrowdGoldsSuccess(response.data)))
      .catch(error => Observable.of(actions.fetchCrowdGoldsError(flattenError(error))));
});

const fetchCrowdGolds = (action$, store) =>
  action$.ofType(actionTypes.FETCH_ITEM).switchMap(action => {
    return Observable.defer(() => requestersApi.get('getCrowdGolds/'+action.jobId))
      .mergeMap(response => Observable.of(actions.fetchItemSuccess(response.data)))
      .catch(error => Observable.of(actions.fetchItemError(flattenError(error))));
});

const getWorkers = (action$, store) =>
  action$.ofType(actionTypes.FETCH_WORKERS).switchMap(action => {
    return Observable.defer(() => requestersApi.get('getWorkersByJob/'+action.jobId))
      .mergeMap(response => Observable.of(actions.fetchWorkersSuccess(response.data)))
      .catch(error => Observable.of(actions.fetchWorkersError(flattenError(error))));
});
const fetchWorkers = (action$, store) =>
  action$.ofType(actionTypes.FETCH_ITEM).switchMap(action => {
    return Observable.defer(() => requestersApi.get(`getWorkersByJob/`+action.jobId))
      .mergeMap(response => Observable.of(actions.fetchItemSuccess(response.data)))
      .catch(error => Observable.of(actions.fetchItemError(flattenError(error))));
});

const getWorkersPairs = (action$, store) =>
  action$.ofType(actionTypes.FETCH_PAIRS).switchMap(action => {
    return Observable.defer(() => requestersApi.get('ww/job/'+action.jobId+'/stats'))
      .mergeMap(response => Observable.of(actions.fetchWorkersPairsSuccess(response.data)))
      .catch(error => Observable.of(actions.fetchWorkersPairsError(flattenError(error))));
});
const fetchWorkersPairs = (action$, store) =>
  action$.ofType(actionTypes.FETCH_ITEM).switchMap(action => {
    return Observable.defer(() => requestersApi.get(`ww/job/`+action.jobId+'/stats'))
      .mergeMap(response => Observable.of(actions.fetchItemSuccess(response.data)))
      .catch(error => Observable.of(actions.fetchItemError(flattenError(error))));
});

const getSingleWorker = (action$, store) =>
  action$.ofType(actionTypes.FETCH_SINGLE).switchMap(action => {
    return Observable.defer(() => requestersApi.get('worker/'+action.workerId+'/job/'+action.jobId+'/stats'))
      .mergeMap(response => Observable.of(actions.fetchSingleWorkerSuccess(response.data)))
      .catch(error => Observable.of(actions.fetchSingleWorkerError(flattenError(error))));
});
const fetchSingleWorker = (action$, store) =>
  action$.ofType(actionTypes.FETCH_ITEM).switchMap(action => {
    return Observable.defer(() => requestersApi.get('worker/'+action.workerId+'/job/'+action.jobId+'/stats'))
      .mergeMap(response => Observable.of(actions.fetchItemSuccess(response.data)))
      .catch(error => Observable.of(actions.fetchItemError(flattenError(error))));
});

const getContribution = (action$, store) =>
  action$.ofType(actionTypes.FETCH_CONTRIBUTION).switchMap(action => {
    return Observable.defer(() => requestersApi.get('worker/job/'+action.jobId+'/contribution'))
      .mergeMap(response => Observable.of(actions.fetchContributionSuccess(response.data)))
      .catch(error => Observable.of(actions.fetchContributionError(flattenError(error))));
});
const fetchContribution = (action$, store) =>
  action$.ofType(actionTypes.FETCH_ITEM).switchMap(action => {
    return Observable.defer(() => requestersApi.get(`worker/job/`+action.jobId+'/contribution'))
      .mergeMap(response => Observable.of(actions.fetchItemSuccess(response.data)))
      .catch(error => Observable.of(actions.fetchItemError(flattenError(error))));
});

const getJobStats = (action$, store) =>
  action$.ofType(actionTypes.FETCH_GLOBAL).switchMap(action => {
    return Observable.defer(() => requestersApi.get('global/job/'+action.jobId+'/stats'))
      .mergeMap(response => Observable.of(actions.fetchJobStatsSuccess(response.data)))
      .catch(error => Observable.of(actions.fetchJobStatsError(flattenError(error))));
});
const fetchJobStats = (action$, store) =>
  action$.ofType(actionTypes.FETCH_ITEM).switchMap(action => {
    return Observable.defer(() => requestersApi.get(`global/job/`+action.jobId+'/stats'))
      .mergeMap(response => Observable.of(actions.fetchItemSuccess(response.data)))
      .catch(error => Observable.of(actions.fetchItemError(flattenError(error))));
});

export default combineEpics(getTaskTime, fetchTaskTime,
                            getWorkers, fetchWorkers, 
                            getWorkers, fetchWorkers,
                            getTasksAgreements, fetchTasksAgreements,
                            getCrowdGolds, fetchCrowdGolds,
                            getWorkersPairs, fetchWorkersPairs,
                            getSingleWorker, fetchSingleWorker,
                            getContribution, fetchContribution,
                            getJobStats, fetchJobStats
                          );