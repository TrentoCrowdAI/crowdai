const actionTypes = {
  VERIFY_GOOGLE_TOKEN: 'C_VERIFY_GOOGLE_TOKEN',
  VERIFY_GOOGLE_TOKEN_SUCCESS: 'C_VERIFY_GOOGLE_TOKEN_SUCCESS',
  VERIFY_GOOGLE_TOKEN_ERROR: 'C_VERIFY_GOOGLE_TOKEN_ERROR'
};

const actions = {
  verifyGoogleToken(token) {
    return {
      type: actionTypes.VERIFY_GOOGLE_TOKEN,
      token
    };
  },

  verifyGoogleTokenSuccess(loginInfo) {
    return {
      type: actionTypes.VERIFY_GOOGLE_TOKEN_SUCCESS,
      loginInfo
    };
  },

  verifyGoogleTokenError(error) {
    return {
      type: actionTypes.VERIFY_GOOGLE_TOKEN_ERROR,
      error
    };
  }
};

export {actionTypes, actions};
