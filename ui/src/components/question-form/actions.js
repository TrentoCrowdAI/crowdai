export const actionTypes = {
  WORKER_ACCEPTED_HIT: 'QF_WORKER_ACCEPTED_HIT',
  NEXT_TASK: 'QF_NEXT_TASK',
  NEXT_TASK_SUCCESS: 'QF_NEXT_TASK_SUCCESS',
  NEXT_TASK_ERROR: 'QF_NEXT_TASK_ERROR',
  SET_ANSWER: 'QF_SET_ANSWER',
  SUBMIT_ANSWER: 'QF_SUBMIT_ANSWER',
  SUBMIT_ANSWER_SUCCESS: 'QF_SUBMIT_ANSWER_SUCCESS',
  SUBMIT_ANSWER_ERROR: 'QF_SUBMIT_ANSWER_ERROR',
  SET_CURRENT_SESSION: 'QF_SET_CURRENT_SESSION'
};

export const actions = {
  setWorkerAcceptedHit(accepted) {
    return {
      type: actionTypes.WORKER_ACCEPTED_HIT,
      accepted
    };
  },

  getNextTask() {
    return {
      type: actionTypes.NEXT_TASK
    };
  },

  getNextTaskSuccess(task) {
    return {
      type: actionTypes.NEXT_TASK_SUCCESS,
      task
    };
  },

  getNextTaskError(error) {
    return {
      type: actionTypes.NEXT_TASK_ERROR,
      error
    };
  },

  setAnswer(taskId, response) {
    return {
      type: actionTypes.SET_ANSWER,
      answer: {
        taskId,
        response
      }
    };
  },

  submitAnswer(answer) {
    return {
      type: actionTypes.SUBMIT_ANSWER,
      answer
    };
  },

  submitAnswerSuccess(response) {
    return {
      type: actionTypes.SUBMIT_ANSWER_SUCCESS,
      response
    };
  },

  submitAnswerError(error) {
    return {
      type: actionTypes.SUBMIT_ANSWER_ERROR,
      error
    };
  },

  setCurrentSession(hitId, assignmentId, workerId) {
    return {
      type: actionTypes.SET_CURRENT_SESSION,
      session: {
        assignmentId,
        hitId,
        workerId
      }
    };
  }
};
