import {Observable} from 'rxjs';
import {combineEpics} from 'redux-observable';

import {actionTypes, actions} from './actions';
import axios, {requestersApi} from 'src/utils/axios';
import {flattenError} from 'src/utils';
import config from 'src/config/config.json';
import {actions as historyActions} from 'src/components/core/history/actions';
import {actions as toastActions} from 'src/components/core/toast/actions';
import ToastTypes from 'src/components/core/toast/types';

const getExperiments = (action$, store) =>
  action$.ofType(actionTypes.FETCH_EXPERIMENTS).switchMap(action => {
    return Observable.defer(() => requestersApi.get(`projects/${action.projectId}/jobs`))
      .mergeMap(response => Observable.of(actions.fetchExperimentsSuccess(response.data)))
      .catch(error => Observable.of(actions.fetchExperimentsError(flattenError(error))));
  });

const saveExperiment = (action$, store) =>
  action$.ofType(actionTypes.SUBMIT).switchMap(action => {
    const {item} = store.getState().experiment.form;
    return Observable.defer(
      () => (item.id ? requestersApi.put(`/jobs/${item.id}`, item.data) : requestersApi.post('/jobs', item))
    )
      .mergeMap(response => Observable.of(actions.submitSuccess()))
      .catch(error => Observable.of(actions.submitError(flattenError(error))));
  });

const fetchExperiment = (action$, store) =>
  action$.ofType(actionTypes.FETCH_ITEM).switchMap(action => {
    return Observable.defer(
      () => (action.isWorker ? axios.get(`jobs/${action.id}`) : requestersApi.get(`jobs/${action.id}`))
    )
      .mergeMap(response => Observable.of(actions.fetchItemSuccess(response.data)))
      .catch(error => Observable.of(actions.fetchItemError(flattenError(error))));
  });

const publishExperiment = (action$, store) =>
  action$.ofType(actionTypes.PUBLISH_EXPERIMENT).switchMap(action => {
    const {item} = store.getState().experiment.form;
    const config = {timeout: 10000};
    return Observable.defer(() => requestersApi.post(`jobs/${item.id}/publish`, {}, config))
      .mergeMap(response => Observable.of(actions.publishSuccess(response.data)))
      .catch(error => Observable.of(actions.publishError(flattenError(error))));
  });

const fetchJobState = (action$, store) =>
  action$.ofType(actionTypes.FETCH_JOB_STATE).switchMap(action => {
    return Observable.defer(() => requestersApi.get(`jobs/${action.id}/state`))
      .mergeMap(response => Observable.of(actions.fetchJobStateSuccess(response.data)))
      .catch(error => Observable.of(actions.fetchJobStateError(flattenError(error))));
  });

const pollJobState = (action$, store) =>
  action$.ofType(actionTypes.FETCH_JOB_STATE_POLLED).switchMap(action => {
    return Observable.concat(
      Observable.of(actions.fetchJobState(action.id)),
      Observable.interval(config.polling.jobState)
        .takeUntil(action$.ofType(actionTypes.FETCH_JOB_STATE_POLLED_DONE))
        .mergeMap(() => Observable.of(actions.fetchJobState(action.id)))
    );
  });

const copyJob = (action$, store) =>
  action$.ofType(actionTypes.COPY_JOB).switchMap(action => {
    return Observable.defer(() => requestersApi.post(`jobs/${action.id}/copy`))
      .mergeMap(response =>
        Observable.concat(
          Observable.of(toastActions.show({message: 'Copy created!', type: ToastTypes.SUCCESS})),
          Observable.of(actions.copyJobSuccess(response.data)),
          Observable.of(actions.fetchItem(response.data.id)),
          Observable.of(
            historyActions.push(`/admin/projects/${response.data.project_id}/screenings/${response.data.id}/edit`)
          )
        )
      )
      .catch(error => Observable.of(actions.copyJobError(flattenError(error))));
  });

export default combineEpics(
  getExperiments,
  saveExperiment,
  fetchExperiment,
  publishExperiment,
  fetchJobState,
  pollJobState,
  copyJob
);
