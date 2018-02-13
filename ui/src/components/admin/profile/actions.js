const actionTypes = {
  FETCH_PROFILE: 'C_FETCH_PROFILE',
  FETCH_PROFILE_SUCCESS: 'C_FETCH_PROFILE_SUCCESS',
  FETCH_PROFILE_ERROR: 'C_FETCH_PROFILE_ERROR',
  SUBMIT: 'C_PROFILE_SUBMIT',
  SUBMIT_SUCCESS: 'C_PROFILE_SUBMIT_SUCCESS',
  SUBMIT_ERROR: 'C_PROFILE_SUBMIT_ERROR',
  SET_INPUT_VALUE: 'C_SET_INPUT_VALUE'
};

const actions = {
  fetchProfile() {
    return {
      type: actionTypes.FETCH_PROFILE
    };
  },

  fetchProfileSuccess(profile) {
    return {
      type: actionTypes.FETCH_PROFILE_SUCCESS,
      profile
    };
  },

  fetchProfileError(error) {
    return {
      type: actionTypes.FETCH_PROFILE_ERROR,
      error
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
  }
};

export {actionTypes, actions};
