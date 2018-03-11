const Boom = require('boom');

const db = require(__base + 'db');
const workersDelegate = require('./workers');
const testTasksDelegate = require('./test-tasks');
const tasksDelegate = require('./tasks');

/**
 * Update task/test_task record with the worker's answer.
 *
 * @param {Object} payload
 */
const saveAnswer = (exports.saveAnswer = async payload => {
  try {
    let worker = await workersDelegate.getByTurkId(payload.session.workerId);

    if (payload.task.test) {
      let testTask = await testTasksDelegate.getTestTaskById(payload.task.id);

      if (testTask.worker_id !== worker.id) {
        throw Boom.badRequest('Worker does not match task record');
      }
      let answersMap = {};

      for (c of payload.task.data.criteria) {
        answersMap[c.label] = c.workerAnswer;
      }

      for (c of testTask.data.criteria) {
        c.workerAnswer = answersMap[c.label];
      }
      testTask.data.answered = true;
      return await testTasksDelegate.updateTestTask(testTask);
    } else {
      let task = await tasksDelegate.getTaskById(payload.task.id);

      if (task.worker_id !== worker.id) {
        throw Boom.badRequest('Worker does not match task record');
      }
      let answersMap = {};

      for (c of payload.task.data.criteria) {
        answersMap[c.label] = c.workerAnswer;
      }

      for (c of task.data.criteria) {
        c.workerAnswer = answersMap[c.label];
      }
      task.data.answered = true;
      return await tasksDelegate.updateTask(task);
    }
  } catch (error) {
    console.error(error);

    if (error.isBoom) {
      throw error;
    }
    throw Boom.badImplementation("Error while trying to save worker's answer");
  }
});
