import {getReducer} from 'src/utils/form';
import {scopes, UserModes} from 'src/utils/constants';

export default getReducer(scopes.PROFILE, {
  data: {
    // AWS related
    accessKeyId: '',
    secretAccessKey: '',
    // Personal information
    email: '',
    name: '',
    givenName: '',
    familyName: '',
    userMode: UserModes.Author
  }
});
