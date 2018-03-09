import {Observable} from 'rxjs';
import {combineEpics} from 'redux-observable';

import {actionTypes, actions} from './actions';
import axios, {requestersApi} from 'src/utils/axios';
import {flattenError} from 'src/utils';

const getExperiments = (action$, store) =>
  action$.ofType(actionTypes.FETCH_EXPERIMENTS).switchMap(action => {
    return Observable.defer(() => requestersApi.get(`projects/${action.projectId}/experiments`))
      .mergeMap(response => Observable.of(actions.fetchExperimentsSuccess(response.data)))
      .catch(error => Observable.of(actions.fetchExperimentsError(flattenError(error))));
  });

const saveExperiment = (action$, store) =>
  action$.ofType(actionTypes.SUBMIT).switchMap(action => {
    const {item} = store.getState().experiment.form;
    return Observable.defer(
      () => (item.id ? requestersApi.put(`/experiments/${item.id}`, item) : requestersApi.post('/experiments', item))
    )
      .mergeMap(response => Observable.of(actions.submitSuccess()))
      .catch(error => Observable.of(actions.submitError(flattenError(error))));
  });

const fetchExperiment = (action$, store) =>
  action$.ofType(actionTypes.FETCH_ITEM).switchMap(action => {
    return Observable.defer(
      () => (action.isWorker ? axios.get(`experiments/${action.id}`) : requestersApi.get(`experiments/${action.id}`))
    )
      .mergeMap(response => Observable.of(actions.fetchItemSuccess(response.data)))
      .catch(error => Observable.of(actions.fetchItemError(flattenError(error))));
  });

const publishExperiment = (action$, store) =>
  action$.ofType(actionTypes.PUBLISH_EXPERIMENT).switchMap(action => {
    const {item} = store.getState().experiment.form;
    const config = {timeout: 10000};
    return Observable.defer(() => requestersApi.post(`experiments/${item.id}/publish`, item, config))
      .mergeMap(response => Observable.of(actions.publishSuccess()))
      .catch(error => Observable.of(actions.publishError(flattenError(error))));
  });

export default combineEpics(getExperiments, saveExperiment, fetchExperiment, publishExperiment);
