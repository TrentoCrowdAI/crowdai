const Boom = require('boom');
const db = require(__base + 'db');

const getAllTasksByJob = (exports.getAllTasksByJob = async id => {
  try {
    let res = await db.query(`
  SELECT times_table.item_id,
      times_table.criteria_id,
      AVG (
        ( EXTRACT ( EPOCH FROM times_table.time_end ) * 1000 - 
          EXTRACT ( EPOCH FROM times_table.time_start ) * 1000 )
        ) AS avgtime_ms 
  FROM
    ( SELECT item_id,
        (data->'criteria')::json#>>'{0,id}' AS criteria_id,
        (data->>'end')::TIMESTAMP WITHOUT TIME ZONE AS time_end,
        (data->>'start')::TIMESTAMP WITHOUT TIME ZONE AS time_start 
      FROM ${db.TABLES.Task_7500}
      WHERE job_id=$1
    ) AS times_table 
  GROUP BY
    times_table.item_id,
    times_table.criteria_id 
  ORDER BY
    times_table.item_id,
    times_table.criteria_id`, [id]);
    return tasks = { tasks: res.rows };
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch the record');
  }
});

const getWorkersByJob = (exports.getWorkersByJob = async id => {
  try {
    let res = await db.query(
    `select distinct t.worker_id, w.turk_id
    from ${db.TABLES.Task_7500} t join ${db.TABLES.Worker} w on t.worker_id=w.id
    where t.job_id=$1
    order by t.worker_id`, [id]);
    return workers = { workers: res.rows };
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch record');
  }
});

const getWorkerTimes = (exports.getWorkerTimes = async (jobId, workerId) => {
  try {
    let res = await db.query(`
  SELECT times_table.item_id,
      times_table.criteria_id,
      AVG (
        ( EXTRACT ( EPOCH FROM times_table.time_end ) * 1000 - 
          EXTRACT ( EPOCH FROM times_table.time_start ) * 1000 )
        ) AS avgtime_ms 
  FROM
    ( SELECT item_id,
        (data->'criteria')::json#>>'{0,id}' AS criteria_id,
        (data->>'end')::TIMESTAMP WITHOUT TIME ZONE AS time_end,
        (data->>'start')::TIMESTAMP WITHOUT TIME ZONE AS time_start 
      FROM ${db.TABLES.Task_7500}
      WHERE job_id=$1 and worker_id=$2
    ) AS times_table 
  GROUP BY
    times_table.item_id,
    times_table.criteria_id 
  ORDER BY
    times_table.item_id,
    times_table.criteria_id`, [jobId,workerId]);
    return tasks = { tasks: res.rows };
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch the record');
  }
});

const workerAnswers = (exports.workerAnswers = async id => {
  try {
    let res = await db.query(
      `select id, item_id, (data->'criteria')::json#>>'{0,id}' as criteria_id, (data->'criteria')::json#>>'{0,workerAnswer}' as answer
    from ${db.TABLES.Task_7500} 
    where worker_id=$1`,
      [id]
    );
    return (tasks = { tasks: res.rows });
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch record');
  }
});
