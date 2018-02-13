import axios from 'axios';
import config from 'src/config/config.json';

const instance = axios.create({
  baseURL: `${config.server}/api/v1`,
  timeout: 5000
});

const axiosAuth = axios.create({
  baseURL: `${config.server}/auth`,
  timeout: 5000
});

const token = localStorage.getItem(config.localStorageKey);

if (token) {
  axiosAuth.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default instance;

export {axiosAuth};
