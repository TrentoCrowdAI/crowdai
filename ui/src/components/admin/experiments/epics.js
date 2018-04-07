import {Observable} from 'rxjs';
import {combineEpics} from 'redux-observable';

import {actionTypes, actions} from './actions';
import axios, {requestersApi} from 'src/utils/axios';
import {flattenError} from 'src/utils';

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

export default combineEpics(getExperiments, saveExperiment, fetchExperiment, publishExperiment);
