import {Observable} from 'rxjs';
import {combineEpics} from 'redux-observable';

import {requestersApi} from 'src/utils/axios';
import {actionTypes} from './shortest-run-actions';
import {actions as toastActions} from 'src/components/core/toast/actions';
import {actions as jobActions} from 'src/components/admin/jobs/actions';
import ToastTypes from 'src/components/core/toast/types';
import {flattenError} from 'src/utils';

const assignFilters = (action$, store) =>
  action$.ofType(actionTypes.ASSIGN_FILTERS).switchMap(action => {
    return Observable.concat(
      Observable.of(jobActions.setLoading(true)),
      Observable.defer(() => requestersApi.post('shortest-run/assign-filters', {jobId: action.jobId}))
        .mergeMap(response =>
          Observable.concat(
            Observable.of(jobActions.setLoading(false)),
            Observable.of(
              toastActions.show({message: 'The list of tasks generated correctly!', type: ToastTypes.SUCCESS})
            ),
            Observable.of(jobActions.fetchItem(action.jobId)),
            Observable.of(jobActions.fetchJobState(action.jobId))
          )
        )
        .catch(error => {
          let err = flattenError(error);
          return Observable.concat(
            Observable.of(jobActions.setLoading(false)),
            Observable.of(toastActions.show({message: err.message, type: ToastTypes.ERROR}))
          );
        })
    );
  });

const generateBaseline = (action$, store) =>
  action$.ofType(actionTypes.GENERATE_BASELINE).switchMap(action => {
    return Observable.concat(
      Observable.of(jobActions.setLoading(true)),
      Observable.defer(() => requestersApi.post('shortest-run/generate-baseline', {jobId: action.jobId}))
        .mergeMap(response =>
          Observable.concat(
            Observable.of(jobActions.setLoading(false)),
            Observable.of(
              toastActions.show({message: 'The list of tasks generated correctly!', type: ToastTypes.SUCCESS})
            ),
            Observable.of(jobActions.fetchItem(action.jobId)),
            Observable.of(jobActions.fetchJobState(action.jobId))
          )
        )
        .catch(error => {
          let err = flattenError(error);
          return Observable.concat(
            Observable.of(jobActions.setLoading(false)),
            Observable.of(toastActions.show({message: err.message, type: ToastTypes.ERROR}))
          );
        })
    );
  });

export default combineEpics(assignFilters, generateBaseline);
