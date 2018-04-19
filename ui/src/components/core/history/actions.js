export const actionTypes = {
  HISTORY_PUSH: 'HISTORY_PUSH'
};

export const actions = {
  push: path => ({
    type: actionTypes.HISTORY_PUSH,
    path
  })
};

export const historyDispatches = dispatch => ({
  historyPush: path => dispatch(actions.push(path))
});
