import Types from './types';
import config from 'src/config/config.json';

export const actionTypes = {
  TOAST_SHOW: 'N_TOAST_SHOW',
  TOAST_DISMISS: 'N_TOAST_DISMISS'
};

export const actions = {
  show(options) {
    const {type = Types.INFO} = options;
    const {header = type} = options;
    const {message} = options;
    const {dismissAfter = config.toastDismissTimeout} = options;

    return {
      type: actionTypes.TOAST_SHOW,
      payload: {header, message, type, dismissAfter}
    };
  },

  dismiss() {
    return {
      type: actionTypes.TOAST_DISMISS
    };
  }
};
