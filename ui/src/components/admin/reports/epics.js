import {Observable} from 'rxjs';
import {combineEpics} from 'redux-observable';

import {actionTypes, actions} from './actions';
import {requestersApi} from 'src/utils/axios';
import {flattenError} from 'src/utils';

const getTaskTime = (action$, store) =>
  action$.ofType(actionTypes.FETCH_TTIME).switchMap(action => {
    return Observable.defer(() => requestersApi.get('allTasksByJobId/'+action.jobId))
      .mergeMap(response => Observable.of(actions.fetchTaskTimeSuccess(response.data)))
      .catch(error => Observable.of(actions.fetchTaskTimeError(flattenError(error))));
  });

const fetchTaskTime = (action$, store) =>
  action$.ofType(actionTypes.FETCH_ITEM).switchMap(action => {
    return Observable.defer(
      () => requestersApi.get(`allTasksByJobId/`+action.jobId))
      .mergeMap(response => Observable.of(actions.fetchItemSuccess(response.data)))
      .catch(error => Observable.of(actions.fetchItemError(flattenError(error))));
  });

  const getWorkerTimes = (action$, store) =>
  action$.ofType(actionTypes.FETCH_WTIME).switchMap(action => {
    return Observable.defer(() => requestersApi.get('allWorkerTimes/'+action.workerId))
      .mergeMap(response => Observable.of(actions.fetchWorkerTimeSuccess(response.data)))
      .catch(error => Observable.of(actions.fetchWorkerTimeError(flattenError(error))));
  });

const fetchWorkerTimes = (action$, store) =>
  action$.ofType(actionTypes.FETCH_ITEM).switchMap(action => {
    return Observable.defer(() => requestersApi.get(`allWorkerTimes/`+action.workerId))
      .mergeMap(response => Observable.of(actions.fetchItemSuccess(response.data)))
      .catch(error => Observable.of(actions.fetchItemError(flattenError(error))));
});

const getWorkers = (action$, store) =>
  action$.ofType(actionTypes.FETCH_WORKERS).switchMap(action => {
    return Observable.defer(() => requestersApi.get('allWorkersByJobId/'+action.jobId))
      .mergeMap(response => Observable.of(actions.fetchWorkersSuccess(response.data)))
      .catch(error => Observable.of(actions.fetchWorkersError(flattenError(error))));
  });

const fetchWorkers = (action$, store) =>
  action$.ofType(actionTypes.FETCH_ITEM).switchMap(action => {
    return Observable.defer(() => requestersApi.get(`allWorkersByJobId/`+action.jobId))
      .mergeMap(response => Observable.of(actions.fetchItemSuccess(response.data)))
      .catch(error => Observable.of(actions.fetchItemError(flattenError(error))));
  });

export default combineEpics(getTaskTime, fetchTaskTime, getWorkers, fetchWorkers, getWorkerTimes, fetchWorkerTimes);
