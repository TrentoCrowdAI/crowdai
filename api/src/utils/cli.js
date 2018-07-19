/**
 * Some CLI commands for debugging purposes.
 */
global.__base = __dirname + '/../';

const program = require('commander');

const testHelpers = require('./test-helpers');
const delegates = require(__base + 'delegates');
const managers = require(__base + 'managers');
const { JobStatus } = require(__base + 'utils/constants');
const { ShortestRunStates } = require(__base + 'plugins/shortest-run/manager');
const db = require(__base + 'db');

program
  .version(process.env.npm_package_version)
  .command('job:addvotes')
  .description('Simulates voting')
  .option('-j, --job <jobId>', 'The job ID')
  .action(async options => {
    const jobId = Number(options.job);
    let job = await delegates.jobs.getById(jobId);
    await testHelpers.simulateVoting(job);
    console.log('Votes generated correctly');
    process.exit(0);
  });

program
  .command('job:expire')
  .description('Expires the HIT associated with the job')
  .option('-j, --job <jobId>', 'The job ID')
  .action(async options => {
    const jobId = Number(options.job);
    let job = await delegates.jobs.getById(jobId);
    await managers.job.expireHIT(job);
    console.log('HIT expired');
    process.exit(0);
  });

program
  .command('job:reset')
  .description('Resets the job status to NOT_PUBLISHED')
  .option('-j, --job <jobId>', 'The job ID')
  .action(async options => {
    const jobId = Number(options.job);
    let job = await delegates.jobs.getById(jobId);
    job.data.hit = undefined;
    job.data.end = undefined;
    job.data.status = JobStatus.NOT_PUBLISHED;

    if (job.data.shortestRun) {
      job.data.shortestRun.state = ShortestRunStates.INITIAL;
    }
    await db.query('delete from result where job_id = $1', [job.id]);
    await db.query('delete from task where job_id = $1', [job.id]);
    await db.query('delete from worker_assignment where job_id = $1', [job.id]);
    await db.query('delete from backlog where job_id = $1', [job.id]);
    await delegates.jobs.update(job.id, job);
    console.log('Reset done');
    process.exit(0);
  });

program
  .version(process.env.npm_package_version)
  .command('job:addgold')
  .description('Generates fake gold data')
  .option('-j, --job <jobId>', 'The job ID')
  .action(async options => {
    const jobId = Number(options.job);
    let job = await delegates.jobs.getById(jobId);
    let filters = await delegates.projects.getCriteria(job.project_id);
    let items = await db.query(
      `select id from ${db.TABLES.Item} where project_id = $1`,
      [job.project_id]
    );
    await db.query('BEGIN');

    for (let i = 0; i < filters.rows.length; i++) {
      let filter = filters.rows[i];

      for (let j = 0; j < items.rows.length; j++) {
        let item = items.rows[j];
        await db.query(
          `insert into gold(item_id, criteria_id, gold) values($1, $2, $3)`,
          [item.id, filter.id, Math.random() > 0.5 ? 'yes' : 'no']
        );
      }
    }
    await db.query('COMMIT');
    console.log('Gold data generated correctly');
    process.exit(0);
  });

program.parse(process.argv);
