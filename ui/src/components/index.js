import {combineReducers} from 'redux';
import {combineEpics} from 'redux-observable';

// epics
import questionFormEpics from 'src/components/question-form/epics';
import rewardEpics from 'src/components/reward-widget/epics';

// reducers
import questionForm from 'src/components/question-form/reducer';
import rewardWidget from 'src/components/reward-widget/reducer';

const rootReducer = combineReducers({
  questionForm,
  rewardWidget
});

const rootEpic = combineEpics(questionFormEpics, rewardEpics);

export {rootReducer, rootEpic};
