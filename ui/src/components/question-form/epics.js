import {Observable} from 'rxjs';
import {combineEpics} from 'redux-observable';

import {actionTypes, actions} from './actions';
import {actions as rewardActions} from 'src/components/reward-widget/actions';
import axios from 'src/utils/axios';
import config from 'src/config/config.json';

const getNextTask = (action$, store) =>
  action$.ofType(actionTypes.NEXT_TASK).switchMap(action => {
    const {session} = store.getState().questionForm;
    const params = {workerId: session.workerId};
    return Observable.defer(() => axios.get('tasks/next', {params}))
      .mergeMap(response => Observable.of(actions.getNextTaskSuccess(response.data)))
      .catch(error => Observable.of(actions.getNextTaskError(error)));
  });

const postAnswer = (action$, store) =>
  action$.ofType(actionTypes.SUBMIT_ANSWER).switchMap(action => {
    return Observable.defer(() => axios.post('answers', action.answer))
      .mergeMap(response =>
        Observable.concat(
          Observable.of(actions.submitAnswerSuccess(response.data)),
          Observable.of(rewardActions.requestReward())
        )
      )
      .catch(error => Observable.of(actions.submitAnswerError(error)));
  });

const finishAssignment = (action$, store) =>
  action$.ofType(actionTypes.FINISH_ASSIGNMENT).switchMap(action => {
    const {session} = store.getState().questionForm;
    return Observable.defer(() => axios.post(`workers/${session.workerId}/finish-assignment`))
      .mergeMap(response =>
        Observable.concat(
          Observable.of(actions.finishAssignmentSuccess()),
          Observable.of(actions.checkAssignmentStatus())
        )
      )
      .catch(error => Observable.of(actions.finishAssignmentError(error)));
  });

const checkAssignmentStatus = (action$, store) =>
  action$.ofType(actionTypes.CHECK_ASSIGNMENT_STATUS).switchMap(action => {
    const {session} = store.getState().questionForm;

    return Observable.defer(() => axios.get(`/workers/${session.workerId}/assignment-status`))
      .mergeMap(response => {
        return Observable.of(actions.checkAssignmentStatusSuccess(response.data));
      })
      .catch(error => Observable.of(actions.checkAssignmentStatusError(error)));
  });

const checkPolling = (action$, store) =>
  action$.ofType(actionTypes.CHECK_POLLING).switchMap(action => {
    const {session} = store.getState().questionForm;

    return Observable.interval(config.pollingInterval)
      .takeUntil(action$.ofType(actionTypes.CHECK_POLLING_DONE))
      .mergeMap(() =>
        Observable.defer(() => axios.get(`/workers/${session.workerId}/assignment-status`))
          .mergeMap(response => {
            if (response.data.finished) {
              return Observable.concat(
                Observable.of(actions.checkPollingDone()),
                Observable.of(actions.checkAssignmentStatusSuccess(response.data))
              );
            }
            return Observable.of(actions.checkPollingKeep());
          })
          .catch(error => Observable.of(actions.checkAssignmentStatusError(error)))
      );
  });

export default combineEpics(getNextTask, postAnswer, finishAssignment, checkAssignmentStatus, checkPolling);
