import {Observable} from 'rxjs';
import {combineEpics} from 'redux-observable';

import {actionTypes, actions} from './actions';
import {actions as rewardActions} from 'src/components/reward-widget/actions';
import axios from 'src/utils/axios';

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
      .mergeMap(response => Observable.of(actions.checkAssignmentStatusSuccess(response.data)))
      .catch(error => Observable.of(actions.checkAssignmentStatusError(error)));
  });

export default combineEpics(getNextTask, postAnswer, finishAssignment, checkAssignmentStatus);
