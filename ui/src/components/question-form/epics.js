import {Observable} from 'rxjs';
import {combineEpics} from 'redux-observable';

import {actionTypes, actions} from './actions';
import axios from 'src/utils/axios';

const getNextTask = (action$, store) =>
  action$.ofType(actionTypes.NEXT_TASK).switchMap(action => {
    return Observable.defer(() => axios.get('tasks/next', {}))
      .mergeMap(response => Observable.of(actions.getNextTaskSuccess(response.data)))
      .catch(error => Observable.concat(Observable.of(actions.getNextTaskError(error))));
  });

const postAnswer = (action$, store) =>
  action$.ofType(actionTypes.SUBMIT_ANSWER).switchMap(action => {
    return Observable.defer(() => axios.post('answers', action.answer))
      .mergeMap(response => Observable.of(actions.submitAnswerSuccess(response.data)))
      .catch(error => Observable.concat(Observable.of(actions.submitAnswerError(error))));
  });

export default combineEpics(getNextTask, postAnswer);
