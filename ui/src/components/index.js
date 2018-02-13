import {combineReducers} from 'redux';
import {combineEpics} from 'redux-observable';

// epics
import questionFormEpics from 'src/components/question-form/epics';
import rewardEpics from 'src/components/reward-widget/epics';
import loginEpics from 'src/components/admin/login/epics';
import experimentEpics from 'src/components/admin/experiments/epics';

// reducers
import questionForm from 'src/components/question-form/reducer';
import rewardWidget from 'src/components/reward-widget/reducer';
import login from 'src/components/admin/login/reducer';
import experiment from 'src/components/admin/experiments/reducer';

const rootReducer = combineReducers({
  questionForm,
  rewardWidget,
  login,
  experiment
});

const rootEpic = combineEpics(questionFormEpics, rewardEpics, loginEpics, experimentEpics);

export {rootReducer, rootEpic};
