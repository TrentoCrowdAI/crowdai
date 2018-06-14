import axios from 'axios';
import config from 'src/config/config.json';

const instance = axios.create({
  baseURL: `${config.server}/workers/api/v1`,
  timeout: config.axios.timeout
});

const axiosAuth = axios.create({
  baseURL: `${config.server}/auth`,
  timeout: config.axios.timeout
});

const requestersApi = axios.create({
  baseURL: `${config.server}/requesters/api/v1`,
  timeout: config.axios.timeout
});

const reportingApi = axios.create({
  baseURL: `http://localhost:5000/`,
  //timeout: config.axios.timeout
});

const token = localStorage.getItem(config.localStorageKey);

if (token) {
  axiosAuth.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  requestersApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  reportingApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default instance;

export {axiosAuth, requestersApi, reportingApi};
