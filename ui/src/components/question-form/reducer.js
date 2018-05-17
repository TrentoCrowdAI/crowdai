import {actionTypes} from './actions';
import cloneDeep from 'clone-deep';

const defaultState = {
  hasAcceptedHit: false,
  task: undefined,
  error: undefined,
  loading: false,
  assignmentStatus: undefined,
  assignmentStatusLoading: false,
  assignmentStatusError: undefined,
  finishAssignmentError: undefined,
  session: {
    assignmentId: undefined,
    hitId: undefined,
    workerId: undefined
  },
  /**
   * an answer has the form of {taskId: <id>, response: 'worker response'}
   */
  answer: undefined,
  answerSaved: undefined,
  answerIsValid: true,
  answerSubmitError: undefined,
  answerSubmitLoading: false
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.WORKER_ACCEPTED_HIT:
      return {
        ...state,
        hasAcceptedHit: action.accepted
      };
    case actionTypes.NEXT_TASK_SUCCESS:
      return {
        ...state,
        task: action.task,
        loading: false,
        answer: undefined,
        answerSaved: undefined,
        answerIsValid: true,
        answerSubmitError: undefined,
        error: undefined
      };
    case actionTypes.NEXT_TASK_ERROR:
      return {
        ...state,
        error: action.error,
        loading: false
      };
    case actionTypes.NEXT_TASK:
      return {
        ...state,
        task: undefined,
        error: undefined,
        loading: true
      };
    case actionTypes.SET_ANSWER:
      let newState = cloneDeep(state);
      let {criteria} = newState.task.data;
      let criterion = criteria.filter(c => c.label === action.answer.criterion.label)[0];
      criterion.workerAnswer = action.answer.response;
      newState.answerIsValid = true;
      return newState;
    case actionTypes.SUBMIT_ANSWER:
      return {
        ...state,
        answerSubmitError: undefined,
        answerSaved: undefined,
        answerSubmitLoading: true
      };
    case actionTypes.SUBMIT_ANSWER_SUCCESS:
      return {
        ...state,
        answerSubmitLoading: false,
        answerSaved: action.response
      };
    case actionTypes.SUBMIT_ANSWER_ERROR:
      return {
        ...state,
        answerSubmitError: action.error,
        answerSubmitLoading: false
      };
    case actionTypes.SET_CURRENT_SESSION:
      return {
        ...state,
        session: action.session
      };
    case actionTypes.FINISH_ASSIGNMENT:
      return {
        ...state,
        assignmentStatus: undefined,
        finishAssignmentError: undefined,
        loading: true
      };
    case actionTypes.FINISH_ASSIGNMENT_SUCCESS:
      return {
        ...state,
        loading: false
      };
    case actionTypes.FINISH_ASSIGNMENT_ERROR:
      return {
        ...state,
        finishAssignmentError: action.error,
        loading: false
      };
    case actionTypes.CHECK_ASSIGNMENT_STATUS:
      return {
        ...state,
        assignmentStatus: undefined,
        assignmentStatusError: undefined,
        assignmentStatusLoading: true
      };

    case actionTypes.CHECK_ASSIGNMENT_STATUS_SUCCESS:
      return {
        ...state,
        assignmentStatus: action.status,
        assignmentStatusLoading: false
      };
    case actionTypes.CHECK_ASSIGNMENT_STATUS_ERROR:
      return {
        ...state,
        assignmentStatusError: action.error,
        assignmentStatusLoading: false
      };
    case actionTypes.CHECK_POLLING:
    case actionTypes.CHECK_POLLING_KEEP:
      return {
        ...state,
        assignmentStatusError: undefined,
        assignmentStatusLoading: true
      };
    case actionTypes.SET_ANSWER_IS_VALID:
      return {
        ...state,
        answerIsValid: action.answerIsValid
      };
    default:
      return state;
  }
};

export default reducer;
