const resultsDelegate = require('./results');
const testHelpers = require(__base + 'utils/test-helpers');
const db = require(__base + 'db');
let dbSpy;

describe('getSummary', () => {
  afterEach(() => {
    if (dbSpy) {
      dbSpy.mockRestore();
    }
  });

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
      await resultsDelegate.getSummary(0);
    } catch (error) {
      ok = false;
    }
    expect(ok).toBe(false);
  });

  test('should return summary', async () => {
    const projectsDelegate = require('./projects');
    const jobsDelegate = require('./jobs');

    projectSpy = jest
      .spyOn(projectsDelegate, 'getItemsCount')
      .mockImplementation(() => 10);

    jobsSpy = jest
      .spyOn(jobsDelegate, 'getById')
      .mockImplementation(() => ({ id: 1 }));

    dbSpy = jest.spyOn(db, 'query').mockImplementation(() => {
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
    projectSpy.mockRestore();
    jobsSpy.mockRestore();
  });
});

describe('getAll', () => {
  test('should throw if jobId is missing', async () => {
    let ok = true;

    try {
      await resultsDelegate.getAll();
    } catch (error) {
      ok = false;
    }
    expect(ok).toBe(false);
  });

  test('should throw if job does not exist', async () => {
    let ok = true;

    try {
      await resultsDelegate.getAll(0);
    } catch (error) {
      ok = false;
    }
    expect(ok).toBe(false);
  });

  test('should return the results', async () => {
    const n = 11;
    let job = await testHelpers.createJob(n, 1);
    let rsp = await db.query(
      `select id from ${db.TABLES.Item} where project_id = $1`,
      [job.project_id]
    );

    for (let item of rsp.rows) {
      await db.query(
        `insert into ${db.TABLES.Result}(job_id, item_id) values($1, $2)`,
        [job.id, item.id]
      );
    }
    const page = 1;
    const pageSize = 5;
    let results = await resultsDelegate.getAll(job.id, page, pageSize);
    expect(results).toBeDefined();
    expect(results.rows.length).toBe(pageSize);
    expect(results.meta.count).toBe(n);
    expect(results.meta.page).toBe(page);
    expect(results.meta.totalPages).toBe(3);
    expect(results.meta.pageSize).toBe(pageSize);
  });
});
