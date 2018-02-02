import {combineReducers} from 'redux';
import {combineEpics} from 'redux-observable';

// epics
import questionFormEpics from 'src/components/question-form/epics';

// reducers
import questionForm from 'src/components/question-form/reducer';

const rootReducer = combineReducers({
  questionForm
});

const rootEpic = combineEpics(questionFormEpics);

export {rootReducer, rootEpic};
