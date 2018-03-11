const Boom = require('boom');

const db = require(__base + 'db');
const testTasksDelegate = require('./test-tasks');
const tasksDelegate = require('./tasks');
const experimentsDelegate = require('./experiments');
const workersDelegate = require('./workers');
const { RejectionType } = workersDelegate;
const { TestAnswerStrategy } = testTasksDelegate;

/**
 * Returns a task for the worker.
 *
 * @param {string} uuid - Experiment's UUID
 * @param {string} workerTurkId - Worker's Mechanical Turk ID.
 * @param {string} assignmentId
 */
exports.next = async (uuid, workerTurkId, assignmentId) => {
  const experiment = await experimentsDelegate.getByUuid(uuid);
  const worker = await workersDelegate.getByTurkId(workerTurkId);

  if (!worker) {
    worker = await workersDelegate.create(workerTurkId);
  }

  const workerId = worker.id;
  const experimentId = experiment.id;
  let key;
  let isInitialTest = false;

  if (!experiment) {
    throw Boom.badRequest('Experiment with the given ID does not exist');
  }

  try {
    const projectId = experiment.project_id;
    // create assignment record if it does not exist.
    let assignment = await workersDelegate.getAssignment(uuid, workerId);

    if (!assignment) {
      // first we pick the criterion for the worker.
      const criteria = await projectsDelegate.getCriteria(
        experiment.project_id
      );
      const idx = Math.floor(Math.random() * criteria.meta.count);

      assignment = await workersDelegate.createAssignment({
        experimentId: experimentId,
        experimentUuid: uuid,
        workerId: workerId,
        data: {
          assignmentId,
          criteria: [criteria.rows[idx].id]
        }
      });
    } else if (assignment.data.finished) {
      return { finished: true };
    }

    const answersCount = await tasksDelegate.getWorkerTasksCount(
      experimentId,
      workerId
    );
    const testCount = await testTasksDelegate.getWorkerTestTasksCount(
      experimentId,
      workerId,
      TestAnswerStrategy.HONEYPOT
    );
    const initialTestCount = await testTasksDelegate.getWorkerTestTasksCount(
      experimentId,
      workerId,
      TestAnswerStrategy.INITIAL
    );

    if (initialTestCount < experiment.data.initialTestsRule) {
      // run initial tests
      let record = await testTasksDelegate.createTestTaskForWorker(
        projectId,
        experimentId,
        workerId,
        assignment.data.criteria,
        true
      );
      return prepareTestTaskRecordForResponse(record);
    } else {
      if (answersCount >= experiment.data.maxTasksRule) {
        return {
          maxTasks: true
        };
      }
      // check if the worker approved the initial tests
      let initialTestScore = await testTasksDelegate.getInitialTestScore(
        experiment,
        workerId
      );

      if (
        initialTestScore < experiment.data.initialTestsMinCorrectAnswersRule
      ) {
        await workersDelegate.rejectAssignment(
          experimentId,
          workerId,
          RejectionType.INITIAL
        );
        return {
          initialTestFailed: true
        };
      }
      // check if the user approved the previous honeypot
      const honeypotApproved = await testTasksDelegate.checkLastHoneypot(
        experimentId,
        workerId
      );

      if (!honeypotApproved) {
        await workersDelegate.rejectAssignment(
          experimentId,
          workerId,
          RejectionType.HONEYPOT
        );
        return {
          honeypotFailed: true
        };
      }

      const runTest =
        (answersCount + testCount + 1) %
          (experiment.data.testFrequencyRule + 1) ===
        0;

      if (runTest) {
        let record = await testTasksDelegate.createTestTaskForWorker(
          projectId,
          experimentId,
          workerId,
          assignment.data.criteria
        );
        return prepareTestTaskRecordForResponse(record);
      } else {
        let record = await tasksDelegate.createTaskForWorker(
          projectId,
          experimentId,
          workerId,
          assignment.data.criteria
        );
        return prepareTaskRecordForResponse(record);
      }
    }
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch next task');
  }
};

const prepareTestTaskRecordForResponse = async testTask => {
  // remove unnecessary fields.
  testTask.data.criteria = testTask.data.criteria.map(c => ({
    label: c.label,
    description: c.description
  }));
  testTask.test = true;
  delete testTask.experiment_id;
  delete testTask.test_id;
  delete testTask.worker_id;
  return testTask;
};

const prepareTaskRecordForResponse = async task => {
  // remove unnecessary fields.
  task.data.criteria = task.data.criteria.map(c => ({
    label: c.label,
    description: c.description
  }));
  delete task.experiment_id;
  delete task.item_id;
  delete task.worker_id;
  return task;
};
