import {actionTypes} from './actions';

const defaultState = {
  item: {
    header: '',
    message: '',
    type: ''
  },
  visible: false
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.TOAST_SHOW:
      const {header, message, type} = action.payload;
      return {
        ...state,
        item: {header, message, type},
        visible: true
      };
    case actionTypes.TOAST_DISMISS:
      return {
        ...state,
        ...defaultState
      };
    default:
      return state;
  }
};

export default reducer;
