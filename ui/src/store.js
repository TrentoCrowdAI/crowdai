import {createStore, applyMiddleware} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import {createEpicMiddleware} from 'redux-observable';

import {rootEpic, rootReducer} from './components';

const epicMiddleware = createEpicMiddleware(rootEpic);
const store = createStore(rootReducer, undefined, composeWithDevTools(applyMiddleware(epicMiddleware)));

export default store;
