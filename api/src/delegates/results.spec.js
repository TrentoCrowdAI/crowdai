const resultsDelegate = require('./results');
const testHelpers = require(__base + 'utils/test-helpers');

describe('getSummary', () => {
  test('should throw if jobId is missing', async () => {
    let ok = true;

    try {
      await resultsDelegate.getSummary();
    } catch (error) {
      ok = false;
    }
    expect(ok).toBe(false);
  });

  test('should throw if job does not exist', async () => {
    let ok = true;

    try {
      await resultsDelegate.getSummary(1);
    } catch (error) {
      ok = false;
    }
    expect(ok).toBe(false);
  });

  test('should return summary', async () => {
    const db = require(__base + 'db');
    const projectsDelegate = require('./projects');
    const jobsDelegate = require('./jobs');

    projectsDelegate.getItemsCount = jest.fn(() => 10);
    jobsDelegate.getById = jest.fn(() => ({ id: 1 }));

    db.query = jest.fn(() => {
      return {
        rows: [
          { count: 1, outcome: 'IN' },
          { count: 4, outcome: 'OUT' },
          { count: 3, outcome: 'STOPPED' }
        ]
      };
    });

    let summary = await resultsDelegate.getSummary(1);
    expect(summary).toBeDefined();
    expect(summary.in).toBe(1);
    expect(summary.out).toBe(4);
    expect(summary.stopped).toBe(3);
    expect(summary.pending).toBe(2);
  });
});
