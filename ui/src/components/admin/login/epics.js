import {Observable} from 'rxjs';
import {combineEpics} from 'redux-observable';

import {actionTypes, actions} from './actions';
import {axiosAuth, requestersApi} from 'src/utils/axios';
import config from 'src/config/config.json';
import {flattenError} from 'src/utils';

const verifyGoogleToken = (action$, store) =>
  action$.ofType(actionTypes.VERIFY_GOOGLE_TOKEN).switchMap(action => {
    if (action.token) {
      // if there is no token in localStorage, then a token will provided in the action.
      axiosAuth.defaults.headers.common['Authorization'] = `Bearer ${action.token}`;
      requestersApi.defaults.headers.common['Authorization'] = `Bearer ${action.token}`;
    }
    return Observable.defer(() => axiosAuth.get('google/verify'))
      .mergeMap(response => {
        if (action.token) {
          localStorage.setItem(config.localStorageKey, action.token);
        }
        return Observable.of(actions.verifyGoogleTokenSuccess(response.data));
      })
      .catch(error => Observable.of(actions.verifyGoogleTokenError(flattenError(error))));
  });

export default combineEpics(verifyGoogleToken);
