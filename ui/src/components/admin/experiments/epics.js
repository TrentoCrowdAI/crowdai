import {Observable} from 'rxjs';
import {combineEpics} from 'redux-observable';

import {actionTypes, actions} from './actions';
import {requestersApi} from 'src/utils/axios';
import {flattenError} from 'src/utils';

const getExperiments = (action$, store) =>
  action$.ofType(actionTypes.FETCH_EXPERIMENTS).switchMap(action => {
    return Observable.defer(() => requestersApi.get('experiments'))
      .mergeMap(response => Observable.of(actions.fetchExperimentsSuccess(response.data)))
      .catch(error => Observable.of(actions.fetchExperimentsError(flattenError(error))));
  });

const saveExperiment = (action$, store) =>
  action$.ofType(actionTypes.SUBMIT).switchMap(action => {
    const {item} = store.getState().experiment.form;
    const profile = store.getState().profile.item;
    item.requesterId = profile.requesterId;
    // this is temporary. We should improve for large files.
    const config = {timeout: 10000};
    return Observable.defer(
      () =>
        item.id
          ? requestersApi.put(`experiments/${item.id}`, item, config)
          : requestersApi.post('experiments', item, config)
    )
      .mergeMap(response => Observable.of(actions.submitSuccess()))
      .catch(error => Observable.of(actions.submitError(flattenError(error))));
  });

export default combineEpics(getExperiments, saveExperiment);
