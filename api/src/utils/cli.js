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

program.parse(process.argv);
