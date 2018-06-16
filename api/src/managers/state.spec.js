const stateManager = require('./state');
const delegates = require(__base + 'delegates');

describe('checkWorkerSolvedMinTasks', () => {
  test('should return true if a worker solved all of their tasks', async () => {
    let getWorkerTasksCountSpy = jest
      .spyOn(delegates.tasks, 'getWorkerTasksCount')
      .mockImplementation(() => 3);

    let getBufferSpy = jest
      .spyOn(delegates.tasks, 'getBuffer')
      .mockImplementation(() => null);

    const job = { id: 1, data: { minTasksRule: 2 } };
    const worker = { id: 1 };
    let solved = await stateManager.checkWorkerSolvedMinTasks(job, worker);
    expect(solved).toBe(true);

    getWorkerTasksCountSpy.mockRestore();
    getBufferSpy.mockRestore();
  });

  test('should return false if a worker does not solve all of their tasks', async () => {
    let getWorkerTasksCountSpy = jest
      .spyOn(delegates.tasks, 'getWorkerTasksCount')
      .mockImplementation(() => 3);

    let getBufferSpy = jest
      .spyOn(delegates.tasks, 'getBuffer')
      .mockImplementation(() => ({ items: [1, 2, 3] }));

    const job = { id: 1, data: { minTasksRule: 5 } };
    const worker = { id: 1 };
    let solved = await stateManager.checkWorkerSolvedMinTasks(job, worker);
    expect(solved).toBe(false);

    getWorkerTasksCountSpy.mockRestore();
    getBufferSpy.mockRestore();
  });

  test('should return false if there are no tasks for the worker', async () => {
    let getWorkerTasksCountSpy = jest
      .spyOn(delegates.tasks, 'getWorkerTasksCount')
      .mockImplementation(() => 0);

    let getBufferSpy = jest
      .spyOn(delegates.tasks, 'getBuffer')
      .mockImplementation(() => null);

    const job = { id: 1, data: { minTasksRule: 5 } };
    const worker = { id: 1 };
    let solved = await stateManager.checkWorkerSolvedMinTasks(job, worker);
    expect(solved).toBe(false);

    getWorkerTasksCountSpy.mockRestore();
    getBufferSpy.mockRestore();
  });

  test('should return true if a worker solves all of their tasks even if it is less than the minimum', async () => {
    let getWorkerTasksCountSpy = jest
      .spyOn(delegates.tasks, 'getWorkerTasksCount')
      .mockImplementation(() => 3);

    let getBufferSpy = jest
      .spyOn(delegates.tasks, 'getBuffer')
      .mockImplementation(() => null);

    const job = { id: 1, data: { minTasksRule: 5 } };
    const worker = { id: 1 };
    let solved = await stateManager.checkWorkerSolvedMinTasks(job, worker);
    expect(solved).toBe(true);

    getWorkerTasksCountSpy.mockRestore();
    getBufferSpy.mockRestore();
  });
});
