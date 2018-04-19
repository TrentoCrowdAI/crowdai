import {combineReducers} from 'redux';
import {combineEpics} from 'redux-observable';

// epics
import questionFormEpics from 'src/components/question-form/epics';
import rewardEpics from 'src/components/reward-widget/epics';
import loginEpics from 'src/components/admin/login/epics';
import experimentEpics from 'src/components/admin/experiments/epics';
import profileEpics from 'src/components/admin/profile/epics';
import projectEpics from 'src/components/admin/projects/epics';
import toastEpics from 'src/components/core/toast/epics';

// reducers
import questionForm from 'src/components/question-form/reducer';
import rewardWidget from 'src/components/reward-widget/reducer';
import login from 'src/components/admin/login/reducer';
import experiment from 'src/components/admin/experiments/reducer';
import profile from 'src/components/admin/profile/reducer';
import project from 'src/components/admin/projects/reducer';
import toast from 'src/components/core/toast/reducer';

const rootReducer = combineReducers({
  questionForm,
  rewardWidget,
  login,
  experiment,
  profile,
  project,
  toast
});

const rootEpic = combineEpics(
  questionFormEpics,
  rewardEpics,
  loginEpics,
  experimentEpics,
  profileEpics,
  projectEpics,
  toastEpics
);

export {rootReducer, rootEpic};
