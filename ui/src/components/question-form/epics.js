import {Observable} from 'rxjs';
import {combineEpics} from 'redux-observable';

import {actionTypes, actions} from './actions';
import {actions as rewardActions} from 'src/components/reward-widget/actions';
import axios from 'src/utils/axios';
import config from 'src/config/config.json';
import {flattenError} from 'src/utils';

const getNextTask = (action$, store) =>
  action$.ofType(actionTypes.NEXT_TASK).switchMap(action => {
    const {session} = store.getState().questionForm;
    const params = {
      workerId: session.workerId,
      assignmentId: session.assignmentId
    };
    return Observable.defer(() => axios.get(`/jobs/${session.jobId}/tasks/next`, {params}))
      .mergeMap(response =>
        Observable.concat(
          Observable.of(actions.checkAssignmentStatus()),
          Observable.of(actions.getNextTaskSuccess(response.data)),
          Observable.of(rewardActions.requestReward())
        )
      )
      .catch(error => Observable.of(actions.getNextTaskError(flattenError(error))));
  });

const postAnswer = (action$, store) =>
  action$.ofType(actionTypes.SUBMIT_ANSWER).switchMap(action => {
    const {session} = store.getState().questionForm;
    return Observable.defer(() => axios.post(`/jobs/${session.jobId}/answers`, action.answer))
      .mergeMap(response =>
        Observable.concat(
          Observable.of(actions.submitAnswerSuccess(response.data)),
          Observable.of(actions.getNextTask()).delay(1000)
        )
      )
      .catch(error => Observable.of(actions.submitAnswerError(flattenError(error))));
  });

const finishAssignment = (action$, store) =>
  action$.ofType(actionTypes.FINISH_ASSIGNMENT).switchMap(action => {
    const {session} = store.getState().questionForm;
    return Observable.defer(() =>
      axios.post(`/jobs/${session.jobId}/workers/${session.workerId}/finish-assignment`, {
        finishedWithError: action.finishedWithError
      })
    )
      .mergeMap(response => {
        let actionsToCall = [Observable.of(actions.finishAssignmentSuccess())];

        if (action.finishedWithError) {
          actionsToCall.push(Observable.of(actions.getNextTaskSuccess(response.data)));
        } else {
          actionsToCall.push(Observable.of(actions.checkAssignmentStatus()));
        }
        return Observable.concat(...actionsToCall);
      })
      .catch(error => Observable.of(actions.finishAssignmentError(flattenError(error))));
  });

const checkAssignmentStatus = (action$, store) =>
  action$.ofType(actionTypes.CHECK_ASSIGNMENT_STATUS).switchMap(action => {
    const {session} = store.getState().questionForm;

    if (!session.workerId) {
      return Observable.of(actions.checkAssignmentStatusSuccess({data: {}}));
    }

    return Observable.defer(() => axios.get(`/jobs/${session.jobId}/workers/${session.workerId}/assignment-status`))
      .mergeMap(response => {
        return Observable.concat(
          Observable.of(actions.checkAssignmentStatusSuccess(response.data)),
          Observable.of(rewardActions.requestReward())
        );
      })
      .catch(error => Observable.of(actions.checkAssignmentStatusError(flattenError(error))));
  });

const checkPolling = (action$, store) =>
  action$.ofType(actionTypes.CHECK_POLLING).switchMap(action => {
    const {session} = store.getState().questionForm;

    return Observable.interval(config.polling.workerAssignment)
      .takeUntil(action$.ofType(actionTypes.CHECK_POLLING_DONE))
      .mergeMap(() =>
        Observable.defer(() => axios.get(`/jobs/${session.jobId}/workers/${session.workerId}/assignment-status`))
          .mergeMap(response => {
            if (response.data.data.finished) {
              return Observable.concat(
                Observable.of(actions.checkPollingDone()),
                Observable.of(actions.checkAssignmentStatusSuccess(response.data))
              );
            }
            return Observable.of(actions.checkPollingKeep());
          })
          .catch(error => Observable.of(actions.checkAssignmentStatusError(flattenError(error))))
      );
  });

export default combineEpics(getNextTask, postAnswer, finishAssignment, checkAssignmentStatus, checkPolling);
