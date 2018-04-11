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
    return Observable.defer(() => requestersApi.get(`allTasksByJobId/`+action.jobId))
      .mergeMap(response => Observable.of(actions.fetchItemSuccess(response.data)))
      .catch(error => Observable.of(actions.fetchItemError(flattenError(error))));
  });

export default combineEpics(getTaskTime, fetchTaskTime);
