const baselineManager = require('./manager');
const testHelpers = require(__base + 'utils/test-helpers');
const delegates = require(__base + 'delegates');

test('should define NAME', () => {
  expect(baselineManager.NAME).toBeDefined();
  expect(baselineManager.NAME).toBe('Baseline');
});

test('should define getEstimatedCost', () => {
  expect(baselineManager.getEstimatedCost).toBeDefined();
});

test('should define processEstimationsPayload', () => {
  expect(baselineManager.processEstimationsPayload).toBeDefined();
});

describe('manager.getEstimatedCost', () => {
  let getItemsCountSpy = jest.spyOn(delegates.projects, 'getItemsCount');
  let getCriteriaSpy = jest.spyOn(delegates.projects, 'getCriteria');

  afterAll(() => {
    getItemsCountSpy.mockRestore();
    getCriteriaSpy.mockRestore();
  });

  let setup = [
    {
      itemsCount: 3,
      filtersCount: 2,
      job: {
        votesPerTaskRule: 2,
        maxTasksRule: 2,
        initialTestsRule: 1,
        testFrequencyRule: 1,
        taskRewardRule: 0.1
      },
      cost: '2.40'
    },
    {
      itemsCount: 3,
      filtersCount: 2,
      job: {
        votesPerTaskRule: 2,
        maxTasksRule: 3,
        initialTestsRule: 1,
        testFrequencyRule: 1,
        taskRewardRule: 0.1
      },
      cost: '2.40'
    },
    {
      itemsCount: 3,
      filtersCount: 2,
      job: {
        votesPerTaskRule: 1,
        maxTasksRule: 4,
        initialTestsRule: 1,
        testFrequencyRule: 1,
        taskRewardRule: 0.1
      },
      cost: '1.20'
    },
    {
      itemsCount: 2,
      filtersCount: 1,
      job: {
        votesPerTaskRule: 3,
        maxTasksRule: 3,
        initialTestsRule: 1,
        testFrequencyRule: 1,
        taskRewardRule: 0.1
      },
      cost: '1.20'
    },
    {
      itemsCount: 10,
      filtersCount: 3,
      job: {
        votesPerTaskRule: 3,
        maxTasksRule: 3,
        initialTestsRule: 2,
        testFrequencyRule: 2,
        taskRewardRule: 0.1
      },
      cost: '18.90'
    }
  ];

  for (let s of setup) {
    test(getDescription(s), async () => {
      job = await testHelpers.createFakeJob(s.job);
      getItemsCountSpy.mockImplementation(() => s.itemsCount);
      getCriteriaSpy.mockImplementation(() => {
        let filters = { rows: [], meta: { count: s.filtersCount } };

        for (let i = 0; i < s.filtersCount; i++) {
          filters.rows.push({ id: i + 1 });
        }
        return filters;
      });

      let cost = await baselineManager.getEstimatedCost(job);
      expect(cost.total.toFixed(2)).toBe(s.cost);
      expect(cost.details).toBeDefined();
      expect(cost.totalWorkers).toBeDefined();
    });
  }
});

function getDescription(setup) {
  return `For parameters:
        itemsCount=${setup.itemsCount}
        filtersCount=${setup.filtersCount}
        votesPerTaskRule=${setup.job.votesPerTaskRule}
        maxTasksRule=${setup.job.maxTasksRule} 
        initialTestsRule=${setup.job.initialTestsRule}
        testFrequencyRule=${setup.job.testFrequencyRule}
        taskRewardRule=${setup.job.taskRewardRule}
      Estimated cost should be: ${setup.cost}
  `;
}
