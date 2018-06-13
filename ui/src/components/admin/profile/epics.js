import {Observable} from 'rxjs';
import {combineEpics} from 'redux-observable';

import {actionTypes, actions} from './actions';
import {requestersApi} from 'src/utils/axios';
import {flattenError} from 'src/utils';
import {actions as toastActions} from 'src/components/core/toast/actions';
import ToastTypes from 'src/components/core/toast/types';

const fetchProfile = (action$, store) =>
  action$.ofType(actionTypes.FETCH_ITEM).switchMap(action => {
    return Observable.defer(() => requestersApi.get('profile'))
      .mergeMap(response => Observable.of(actions.fetchItemSuccess(response.data)))
      .catch(error => {
        let err = flattenError(error);
        return Observable.concat(
          Observable.of(actions.fetchItemError(flattenError(err))),
          Observable.of(toastActions.show({message: err.message, type: ToastTypes.ERROR}))
        );
      });
  });

const saveProfile = (action$, store) =>
  action$.ofType(actionTypes.SUBMIT).switchMap(action => {
    const {item} = store.getState().profile;
    return Observable.defer(() => requestersApi.put(`profile/${item.id}`, item))
      .mergeMap(response =>
        Observable.concat(
          Observable.of(toastActions.show({message: 'Profile saved!', type: ToastTypes.SUCCESS})),
          Observable.of(actions.submitSuccess())
        )
      )
      .catch(error => {
        let err = flattenError(error);
        return Observable.concat(
          Observable.of(actions.submitError(flattenError(err))),
          Observable.of(toastActions.show({message: err.message, type: ToastTypes.ERROR}))
        );
      });
  });

export default combineEpics(fetchProfile, saveProfile);
