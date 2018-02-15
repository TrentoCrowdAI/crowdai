import {getReducer} from 'src/utils/form';
import {scopes} from 'src/utils/constants';

export default getReducer(scopes.PROFILE, {
  // AWS related
  requesterId: '',
  accessKeyId: '',
  secretAccessKey: '',
  // Personal information
  email: '',
  name: '',
  givenName: '',
  familyName: ''
});
