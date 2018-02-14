export const actionTypes = {
  WORKER_ACCEPTED_HIT: 'C_WORKER_ACCEPTED_HIT',
  NEXT_TASK: 'C_NEXT_TASK',
  NEXT_TASK_SUCCESS: 'C_NEXT_TASK_SUCCESS',
  NEXT_TASK_ERROR: 'C_NEXT_TASK_ERROR',
  SET_ANSWER: 'C_SET_ANSWER',
  SUBMIT_ANSWER: 'C_SUBMIT_ANSWER',
  SUBMIT_ANSWER_SUCCESS: 'C_SUBMIT_ANSWER_SUCCESS',
  SUBMIT_ANSWER_ERROR: 'C_SUBMIT_ANSWER_ERROR',
  SET_CURRENT_SESSION: 'C_SET_CURRENT_SESSION',
  FINISH_ASSIGNMENT: 'C_FINISH_ASSIGNMENT',
  FINISH_ASSIGNMENT_SUCCESS: 'C_FINISH_ASSIGNMENT_SUCCESS',
  FINISH_ASSIGNMENT_ERROR: 'C_FINISH_ASSIGNMENT_ERROR',
  CHECK_ASSIGNMENT_STATUS: 'C_CHECK_ASSIGNMENT_STATUS',
  CHECK_ASSIGNMENT_STATUS_SUCCESS: 'C_CHECK_ASSIGNMENT_STATUS_SUCCESS',
  CHECK_ASSIGNMENT_STATUS_ERROR: 'C_CHECK_ASSIGNMENT_STATUS_ERROR',
  CHECK_POLLING: 'C_CHECK_POLLING',
  CHECK_POLLING_DONE: 'C_CHECK_POLLING_DONE',
  CHECK_POLLING_KEEP: 'C_CHECK_POLLING_KEEP'
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

  setAnswer(task, response) {
    return {
      type: actionTypes.SET_ANSWER,
      answer: {
        task,
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

  setCurrentSession(hitId, assignmentId, workerId, experimentId) {
    return {
      type: actionTypes.SET_CURRENT_SESSION,
      session: {
        assignmentId,
        hitId,
        workerId,
        experimentId
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
