import axios from 'axios';
import config from 'src/config/config.json';

const instance = axios.create({
  baseURL: `${config.server}/api/v1`,
  timeout: 5000
});

export default instance;
