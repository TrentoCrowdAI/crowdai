import {actionTypes} from './actions';
import {history} from './';

const historyMiddleware = store => next => action => {
  let result = next(action);

  if (action.type === actionTypes.HISTORY_PUSH && history.location.pathname !== result.path) {
    history.push(result.path);
  }
};

export default historyMiddleware;
