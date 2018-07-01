const coordinator = require('./coordinator');
const testHelpers = require(__base + 'utils/test-helpers');

describe('getEstimatedCost', () => {
  test('should define getEstimatedCost', () => {
    expect(coordinator.getEstimatedCost).toBeDefined();
  });

  test('should throw if job is undefined', async () => {
    let ok = true;

    try {
      await coordinator.getEstimatedCost();
    } catch (error) {
      ok = false;
    }
    expect(ok).toBe(false);
  });

  test('should throw if job does not have task assignment strategy', async () => {
    let job = await testHelpers.createFakeJob();
    let ok = true;

    try {
      await coordinator.getEstimatedCost(job);
    } catch (error) {
      ok = false;
    }
    expect(ok).toBe(false);
  });

  test('should throw if a manager does not exists for the task assignment strategy', async () => {
    let taskAssigmentApi = await testHelpers.createFakeTaskAssignmentApi();
    let job = await testHelpers.createFakeJob({
      taskAssignmentStrategy: taskAssigmentApi.id
    });
    let ok = true;

    try {
      await coordinator.getEstimatedCost(job);
    } catch (error) {
      ok = false;
    }
    expect(ok).toBe(false);
  });

  test('if strategy is Baseline, it should call baselineManager', async () => {
    const baselineManager = require('./baseline/manager');
    let called = false;
    baselineManager.getEstimatedCost = jest.fn(() => (called = true));
    let taskAssigmentApi = await testHelpers.createFakeTaskAssignmentApi(
      'Baseline'
    );
    let job = await testHelpers.createFakeJob({
      taskAssignmentStrategy: taskAssigmentApi.id
    });
    await coordinator.getEstimatedCost(job);
    expect(called).toBe(true);
  });

  test('if strategy is Shortest Run, it should call shortestRunManager', async () => {
    const shortestRunManager = require('./shortest-run/manager');
    let called = false;
    shortestRunManager.getEstimatedCost = jest.fn(() => (called = true));
    let taskAssigmentApi = await testHelpers.createFakeTaskAssignmentApi(
      'Shortest Run'
    );
    let job = await testHelpers.createFakeJob({
      taskAssignmentStrategy: taskAssigmentApi.id
    });
    await coordinator.getEstimatedCost(job);
    expect(called).toBe(true);
  });
});

test('should define processEstimationsPayload', () => {
  expect(coordinator.processEstimationsPayload).toBeDefined();
});
