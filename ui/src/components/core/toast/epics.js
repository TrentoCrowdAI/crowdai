import {Observable} from 'rxjs';

import {actionTypes, actions} from './actions';

const show = (action$, store) =>
  action$
    .ofType(actionTypes.TOAST_SHOW)
    .switchMap(action => Observable.of(actions.dismiss()).delay(action.payload.dismissAfter));

export default show;
