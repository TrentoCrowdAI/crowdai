import {Observable} from 'rxjs';
import {combineEpics} from 'redux-observable';

import {actionTypes, actions} from './actions';
import axios, {requestersApi} from 'src/utils/axios';
import {flattenError} from 'src/utils';

const getProjects = (action$, store) =>
  action$.ofType(actionTypes.FETCH_PROJECTS).switchMap(action => {
    return Observable.defer(() => requestersApi.get('projects'))
      .mergeMap(response => Observable.of(actions.fetchProjectsSuccess(response.data)))
      .catch(error => Observable.of(actions.fetchProjectsError(flattenError(error))));
  });

const saveProject = (action$, store) =>
  action$.ofType(actionTypes.SUBMIT).switchMap(action => {
    const {item} = store.getState().project.form;
    const profile = store.getState().profile.item;
    item.requester_id = profile.id;
    // this is temporary. We should improve for large files.
    const config = {timeout: 10000};
    return Observable.defer(
      () =>
        item.id ? requestersApi.put(`projects/${item.id}`, item, config) : requestersApi.post('projects', item, config)
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

export default combineEpics(getProjects, saveProject, fetchExperiment);
