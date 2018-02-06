export const actionTypes = {
  WORKER_ACCEPTED_HIT: 'QF_WORKER_ACCEPTED_HIT',
  NEXT_TASK: 'QF_NEXT_TASK',
  NEXT_TASK_SUCCESS: 'QF_NEXT_TASK_SUCCESS',
  NEXT_TASK_ERROR: 'QF_NEXT_TASK_ERROR',
  SET_ANSWER: 'QF_SET_ANSWER',
  SUBMIT_ANSWER: 'QF_SUBMIT_ANSWER',
  SUBMIT_ANSWER_SUCCESS: 'QF_SUBMIT_ANSWER_SUCCESS',
  SUBMIT_ANSWER_ERROR: 'QF_SUBMIT_ANSWER_ERROR',
  SET_CURRENT_SESSION: 'QF_SET_CURRENT_SESSION',
  FINISH_ASSIGNMENT: 'QF_FINISH_ASSIGNMENT',
  FINISH_ASSIGNMENT_SUCCESS: 'QF_FINISH_ASSIGNMENT_SUCCESS',
  FINISH_ASSIGNMENT_ERROR: 'QF_FINISH_ASSIGNMENT_ERROR',
  CHECK_ASSIGNMENT_STATUS: 'QF_CHECK_ASSIGNMENT_STATUS',
  CHECK_ASSIGNMENT_STATUS_SUCCESS: 'QF_CHECK_ASSIGNMENT_STATUS_SUCCESS',
  CHECK_ASSIGNMENT_STATUS_ERROR: 'QF_CHECK_ASSIGNMENT_STATUS_ERROR',
  CHECK_POLLING: 'QF_CHECK_POLLING',
  CHECK_POLLING_DONE: 'QF_CHECK_POLLING_DONE',
  CHECK_POLLING_KEEP: 'QF_CHECK_POLLING_KEEP'
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
  },

  finishAssignment() {
    return {
      type: actionTypes.FINISH_ASSIGNMENT
    };
  },

  finishAssignmentSuccess() {
    return {
      type: actionTypes.FINISH_ASSIGNMENT_SUCCESS
    };
  },

  finishAssignmentError(error) {
    return {
      type: actionTypes.FINISH_ASSIGNMENT_ERROR,
      error
    };
  },

  checkAssignmentStatus() {
    return {
      type: actionTypes.CHECK_ASSIGNMENT_STATUS
    };
  },

  checkAssignmentStatusSuccess(status) {
    return {
      type: actionTypes.CHECK_ASSIGNMENT_STATUS_SUCCESS,
      status
    };
  },

  checkAssignmentStatusError(error) {
    return {
      type: actionTypes.CHECK_ASSIGNMENT_STATUS_ERROR,
      error
    };
  },

  checkPolling() {
    return {
      type: actionTypes.CHECK_POLLING
    };
  },

  checkPollingDone() {
    return {
      type: actionTypes.CHECK_POLLING_DONE
    };
  },

  checkPollingKeep() {
    return {
      type: actionTypes.CHECK_POLLING_KEEP
    };
  }
};
