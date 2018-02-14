import {getReducer} from 'src/utils/form';
import {scopes} from 'src/utils/constants';

export default getReducer(scopes.PROFILE, {
  requesterId: '',
  email: '',
  name: '',
  givenName: '',
  familyName: ''
});
