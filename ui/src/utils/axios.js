import axios from 'axios';

import config from 'src/config/config.json';
import {actions as historyActions} from 'src/components/core/history/actions';
import store from 'src/store';

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

axiosAuth.interceptors.response.use(response => response, responseErrorHandler);
requestersApi.interceptors.response.use(response => response, responseErrorHandler);

function responseErrorHandler(error) {
  if (error.response.status === 401) {
    store.dispatch(historyActions.push('/login'));
  }
  return Promise.reject(error);
}

export default instance;

export {axiosAuth, requestersApi, reportingApi};
