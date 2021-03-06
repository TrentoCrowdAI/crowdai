import {Observable} from 'rxjs';
import {combineEpics} from 'redux-observable';

import {actionTypes, actions} from './actions';
import axios from 'src/utils/axios';

const getWorkerReward = (action$, store) =>
  action$.ofType(actionTypes.REQUEST_REWARD).switchMap(action => {
    const {session} = store.getState().questionForm;
    return Observable.defer(() => axios.get(`/jobs/${session.jobId}/workers/${session.workerId}/reward`))
      .mergeMap(response => Observable.of(actions.requestRewardSuccess(response.data.reward)))
      .catch(error => Observable.of(actions.requestRewardError(error)));
  });

export default combineEpics(getWorkerReward);
