import {scopes} from 'src/utils/constants';
import {getActionTypes, getActions} from 'src/utils/form';

const actionTypes = {
  ...getActionTypes(scopes.PROFILE)
};

const actions = {
  ...getActions(scopes.PROFILE)
};

export {actionTypes, actions};
