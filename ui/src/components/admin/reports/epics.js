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


const getWorkerTimes = (action$, store) =>
  action$.ofType(actionTypes.FETCH_WTIME).switchMap(action => {
    return Observable.defer(() => requestersApi.get('getWorkerTimes/'+action.jobId+'/'+action.workerId))
      .mergeMap(response => Observable.of(actions.fetchWorkerTimesSuccess(response.data)))
      .catch(error => Observable.of(actions.fetchWorkerTimesError(flattenError(error))));
  });

const fetchWorkerTimes = (action$, store) =>
  action$.ofType(actionTypes.FETCH_ITEM).switchMap(action => {
    return Observable.defer(() => requestersApi.get(`getWorkerTimes/`+action.jobId+'/'+action.workerId))
      .mergeMap(response => Observable.of(actions.fetchItemSuccess(response.data)))
      .catch(error => Observable.of(actions.fetchItemError(flattenError(error))));
});

const getAnswers = (action$, store) =>
  action$.ofType(actionTypes.FETCH_WANSWERS).switchMap(action => {
    return Observable.defer(() => requestersApi.get('getWorkerAnswers/'+action.jobId+'/'+action.workerId))
      .mergeMap(response => Observable.of(actions.fetchAnswersSuccess(response.data)))
      .catch(error => Observable.of(actions.fetchAnswersError(flattenError(error))));
  });

const fetchAnswers = (action$, store) =>
  action$.ofType(actionTypes.FETCH_ITEM).switchMap(action => {
    return Observable.defer(() => requestersApi.get(`getWorkerAnswers/`+action.jobId+'/'+action.workerId))
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

const getWorkersAgreements = (action$, store) =>
action$.ofType(actionTypes.FETCH_WAGREES).switchMap(action => {
  return Observable.defer(() => requestersApi.get('getWorkersAgreements/'+action.jobId+'/'+action.itemId+'/'+action.criteriaId))
    .mergeMap(response => Observable.of(actions.fetchWorkersAgreementsSuccess(response.data)))
    .catch(error => Observable.of(actions.fetchWorkersAgreementsError(flattenError(error))));
});

const fetchWorkersAgreements = (action$, store) =>
  action$.ofType(actionTypes.FETCH_ITEM).switchMap(action => {
    return Observable.defer(() => requestersApi.get('getWorkersAgreements/'+action.jobId+'/'+action.itemId+'/'+action.criteriaId))
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

export default combineEpics(getTaskTime, fetchTaskTime,
                            getWorkers, fetchWorkers, 
                            getWorkerTimes, fetchWorkerTimes, 
                            getAnswers, fetchAnswers,
                            getWorkers, fetchWorkers,
                            getTasksAgreements, fetchTasksAgreements,
                            getWorkersAgreements, fetchWorkersAgreements
                          );
