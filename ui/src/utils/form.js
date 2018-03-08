import set from 'set-value';
import cloneDeep from 'clone-deep';

const getActionTypes = scope => {
  return {
    CLEAN_STATE: `C_${scope}_FORM_CLEAN_STATE`,
    SUBMIT: `C_${scope}_FORM_SUBMIT`,
    SUBMIT_SUCCESS: `C_${scope}_FORM_SUBMIT_SUCCESS`,
    SUBMIT_ERROR: `C_${scope}_FORM_SUBMIT_ERROR`,
    SET_INPUT_VALUE: `C_${scope}_SET_INPUT_VALUE`,
    FETCH_ITEM: `C_${scope}_FETCH_ITEM`,
    FETCH_ITEM_SUCCESS: `C_${scope}_FETCH_ITEM_SUCCESS`,
    FETCH_ITEM_ERROR: `C_${scope}_FETCH_ITEM_ERROR`,
    RESET_SAVED: `C_${scope}_FORM_RESET_SAVED`
  };
};

const getActions = scope => {
  const actionTypes = getActionTypes(scope);

  return {
    resetSaved() {
      return {
        type: actionTypes.RESET_SAVED
      };
    },

    cleanState() {
      return {
        type: actionTypes.CLEAN_STATE
      };
    },

    submit() {
      return {
        type: actionTypes.SUBMIT
      };
    },

    submitSuccess() {
      return {
        type: actionTypes.SUBMIT_SUCCESS
      };
    },

    submitError(error) {
      return {
        type: actionTypes.SUBMIT_ERROR,
        error
      };
    },

    setInputValue(name, value) {
      return {
        type: actionTypes.SET_INPUT_VALUE,
        name,
        value
      };
    },

    fetchItem(id) {
      return {
        type: actionTypes.FETCH_ITEM,
        id
      };
    },

    fetchItemSuccess(item) {
      return {
        type: actionTypes.FETCH_ITEM_SUCCESS,
        item
      };
    },

    fetchItemError(error) {
      return {
        type: actionTypes.FETCH_ITEM_ERROR,
        error
      };
    }
  };
};

const getReducer = (scope, formFields) => {
  const actionTypes = getActionTypes(scope);
  const defaultState = {
    item: {
      ...formFields
    },
    error: undefined,
    loading: false,
    saved: false
  };

  return (state = defaultState, action) => {
    switch (action.type) {
      case actionTypes.RESET_SAVED:
        return {
          ...state,
          saved: false
        };
      case actionTypes.CLEAN_STATE:
        return {
          ...defaultState
        };
      case actionTypes.SUBMIT:
        return {
          ...state,
          loading: true,
          error: undefined,
          saved: false
        };
      case actionTypes.SUBMIT_SUCCESS:
        return {
          ...state,
          loading: false,
          saved: true
        };
      case actionTypes.SUBMIT_ERROR:
        return {
          ...state,
          loading: false,
          error: action.error
        };
      case actionTypes.SET_INPUT_VALUE:
        let newState = cloneDeep(state);
        set(newState.item, action.name, action.value);
        return newState;
      case actionTypes.FETCH_ITEM:
        return {
          ...state,
          error: undefined,
          loading: true,
          saved: false
        };
      case actionTypes.FETCH_ITEM_SUCCESS:
        return {
          ...state,
          loading: false,
          item: {
            ...formFields,
            ...action.item
          }
        };
      case actionTypes.FETCH_ITEM_ERROR:
        return {
          ...state,
          error: action.error,
          loading: false
        };
      default:
        return state;
    }
  };
};

export {getActionTypes, getActions, getReducer};
