const delegates = require(__base + 'delegates');
const shortestRunManager = require('./manager');
const { ShortestRunStates } = shortestRunManager;
const testHelpers = require(__base + 'utils/test-helpers');

test('should define NAME', () => {
  expect(shortestRunManager.NAME).toBeDefined();
  expect(shortestRunManager.NAME).toBe('Shortest Run');
});

test('should define getEstimatedCost', () => {
  expect(shortestRunManager.getEstimatedCost).toBeDefined();
});

describe('manager.generateBaseline', async () => {
  let job;

  beforeAll(async () => {
    job = await testHelpers.createFakeJob({
      shortestRun: { state: shortestRunManager.ShortestRunStates.INITIAL }
    });

    delegates.taskAssignmentApi.getById = jest.fn(() => {
      return { url: 'http://url' };
    });
  });

  test('should throw if jobId is null', async () => {
    let ok = true;

    try {
      await shortestRunManager.generateBaseline();
    } catch (error) {
      ok = false;
    }
    expect(ok).toBe(false);
  });

  test('should update shortestRun.state to BASELINE_GENERATED', async () => {
    await shortestRunManager.generateBaseline(job.id, 20);
    let jobUpdated = await delegates.jobs.getById(job.id);
    expect(jobUpdated.data.shortestRun.state).toBe(
      shortestRunManager.ShortestRunStates.BASELINE_GENERATED
    );
  });
});

describe('manager.getEstimatedCost', () => {
  const db = require(__base + 'db');
  let originalQuery = db.query;

  afterEach(() => {
    if (db.query.mockReset) {
      db.query = originalQuery;
    }
  });

  let setup = [
    {
      state: ShortestRunStates.BASELINE_GENERATED,
      mockedBacklogOutput: {
        rows: [{ filter: 1, count: 3 }, { filter: 2, count: 3 }]
      },
      job: {
        votesPerTaskRule: 2,
        maxTasksRule: 3,
        initialTestsRule: 3,
        testFrequencyRule: 2,
        taskRewardRule: 0.2
      },
      cost: '5.60'
    },
    {
      state: ShortestRunStates.BASELINE_GENERATED,
      mockedBacklogOutput: {
        rows: [{ filter: 1, count: 3 }]
      },
      job: {
        votesPerTaskRule: 1,
        maxTasksRule: 3,
        initialTestsRule: 3,
        testFrequencyRule: 1,
        taskRewardRule: 0.1
      },
      cost: '0.80'
    },
    {
      state: ShortestRunStates.FILTERS_ASSIGNED,
      mockedBacklogOutput: {
        rows: [{ filter: 1, count: 3 }, { filter: 2, count: 1 }]
      },
      job: {
        maxTasksRule: 3,
        initialTestsRule: 3,
        testFrequencyRule: 1,
        taskRewardRule: 0.1
      },
      cost: '1.20'
    },
    {
      state: ShortestRunStates.FILTERS_ASSIGNED,
      mockedBacklogOutput: {
        rows: [{ filter: 1, count: 17 }]
      },
      job: {
        maxTasksRule: 3,
        initialTestsRule: 3,
        testFrequencyRule: 1,
        taskRewardRule: 0.1
      },
      cost: '4.60'
    },
    {
      state: ShortestRunStates.FILTERS_ASSIGNED,
      mockedBacklogOutput: {
        rows: [{ filter: 1, count: 10 }, { filter: 2, count: 1 }]
      },
      job: {
        maxTasksRule: 2,
        initialTestsRule: 1,
        testFrequencyRule: 1,
        taskRewardRule: 0.1
      },
      cost: '2.20'
    }
  ];

  test('should return 0 if state is neither BASELINE_GENERATED nor FILTERS_ASSIGNED', async () => {
    job = await testHelpers.createFakeJob({
      shortestRun: { state: shortestRunManager.ShortestRunStates.INITIAL }
    });
    let cost = await shortestRunManager.getEstimatedCost(job);
    expect(cost).toBe(0);
  });

  for (let s of setup) {
    test(getDescription(s), async () => {
      job = await testHelpers.createFakeJob({
        shortestRun: {
          state: s.state
        },
        ...s.job
      });
      db.query = jest.fn(() => {
        return s.mockedBacklogOutput;
      });
      let cost = await shortestRunManager.getEstimatedCost(job);
      expect(cost.toFixed(2)).toBe(s.cost);
    });
  }
});

function getDescription(setup) {
  return `For parameters:
        state=${setup.state}
        backlog=${JSON.stringify(setup.mockedBacklogOutput)}
        votesPerTaskRule=${setup.job.votesPerTaskRule}
        maxTasksRule=${setup.job.maxTasksRule} 
        initialTestsRule=${setup.job.initialTestsRule}
        testFrequencyRule=${setup.job.testFrequencyRule}
        taskRewardRule=${setup.job.taskRewardRule}
      Estimated cost should be: ${setup.cost}
  `;
}
