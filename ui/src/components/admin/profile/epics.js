import {Observable} from 'rxjs';
import {combineEpics} from 'redux-observable';

import {actionTypes, actions} from './actions';
import {requestersApi} from 'src/utils/axios';
import {flattenError} from 'src/utils';

const fetchProfile = (action$, store) =>
  action$.ofType(actionTypes.FETCH_PROFILE).switchMap(action => {
    return Observable.defer(() => requestersApi.get('profile'))
      .mergeMap(response => Observable.of(actions.fetchProfileSuccess(response.data)))
      .catch(error => Observable.of(actions.fetchProfileError(flattenError(error))));
  });

const saveProfile = (action$, store) =>
  action$.ofType(actionTypes.SUBMIT).switchMap(action => {
    const {profile} = store.getState().profile;
    return Observable.defer(() => requestersApi.put(`profile/${profile.id}`, profile))
      .mergeMap(response => Observable.of(actions.submitSuccess()))
      .catch(error => Observable.of(actions.submitError(flattenError(error))));
  });

export default combineEpics(fetchProfile, saveProfile);
