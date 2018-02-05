import {actionTypes} from './actions';

const defaultState = {
  hasAcceptedHit: false,
  task: undefined,
  error: undefined,
  loading: false,
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
        loading: false
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
        loading: true
      };
    case actionTypes.SET_ANSWER:
      return {
        ...state,
        answer: action.answer
      };
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
    default:
      return state;
  }
};

export default reducer;
