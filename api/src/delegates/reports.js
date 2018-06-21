const Boom = require('boom');
const db = require(__base + 'db');

const getAllTasksTimesByJob = (exports.getAllTasksTimesByJob = async id => {
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
      FROM ${db.TABLES.Task}
      WHERE job_id=$1 AND (data->'answered')='true'
    ) AS times_table 
  GROUP BY
    times_table.item_id,
    times_table.criteria_id 
  ORDER BY
    times_table.item_id,
    times_table.criteria_id`, [id]);
    console.log(res.rows)
    return tasks = { tasks: res.rows };
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch the record');
  }
});

const getWorkersByJob = (exports.getWorkersByJob = async id => {
  try {
    let res = await db.query(
    `SELECT DISTINCT t.worker_id, w.turk_id
    FROM ${db.TABLES.Task} t JOIN ${db.TABLES.Worker} w ON t.worker_id=w.id
    WHERE t.job_id=$1 AND (t.data->'answered')='true'
    ORDER BY t.worker_id`, [id]);
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
      FROM ${db.TABLES.Task}
      WHERE job_id=$1 AND worker_id=$2 AND (data->'answered')='true'
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

const getWorkerAnswers = (exports.getWorkerAnswers = async (jobId,workerId) => {
  try {
    let res = await db.query(
      `SELECT id, item_id, (data->'criteria')::json#>>'{0,id}' AS criteria_id, (data->'criteria')::json#>>'{0,workerAnswer}' AS answer
    FROM ${db.TABLES.Task} 
    WHERE worker_id=$2 AND job_id=$1 AND (data->'answered')='true'`,
      [jobId,workerId]);
    return (tasks = { tasks: res.rows });
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch record');
  }
});

const getTasksAgreements = (exports.getTasksAgreements = async id => {
  try {
    let res = await db.query(
    `SELECT item_id,(data->'criteria')::json#>>'{0,id}' AS criteria_id,
      COUNT( CASE (data->'criteria')::json#>>'{0,workerAnswer}' WHEN 'yes' THEN 1 ELSE null END) AS yes,
      COUNT( CASE (data->'criteria')::json#>>'{0,workerAnswer}' WHEN 'no' THEN 1 ELSE null END) AS no,
      COUNT( CASE (data->'criteria')::json#>>'{0,workerAnswer}' WHEN 'not clear' THEN 1 ELSE null END) AS "not clear"
    FROM ${db.TABLES.Task}
    WHERE job_id=$1 AND (data->'answered')='true'
    GROUP BY item_id,(data->'criteria')::json#>>'{0,id}'
    ORDER BY item_id,(data->'criteria')::json#>>'{0,id}'`,
      [id]);
    return tasks = { tasks: res.rows }
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch record');
  }
});

const getWorkersAgreements = (exports.getWorkersAgreements = async (jobId) => {
  try {
    let res = await db.query(`
      SELECT item_id,(data->'criteria')::json#>>'{0,id}' AS criteria_id,worker_id,(data->'criteria')::json#>>'{0,workerAnswer}' AS answer
      FROM ${db.TABLES.Task}
      WHERE job_id=$1 AND (data->'answered')='true'
    `, [jobId])
    return tasks = { tasks: res.rows }
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch record');
  }
});

const getCrowdGolds = (exports.getCrowdGolds = async (jobId) => {
  try {
    let res = await db.query(`
      select distinct a.item_id, cast((a.data->'criteria')::json#>>'{0,id}' as bigint) as criteria_id,
        (
          select (b.data->'criteria')::json#>>'{0,workerAnswer}' as answer
          from ${db.TABLES.Task} b
          where b.item_id=a.item_id 
          and (b.data->'criteria')::json#>>'{0,id}'=(a.data->'criteria')::json#>>'{0,id}'
          and b.job_id=$1
          group by b.item_id, b.data
          order by count(*) desc
          limit 1
        ) as answer
      from ${db.TABLES.Task} a
      where a.job_id=$1
      group by a.item_id, a.data,(a.data->'criteria')::json#>>'{0,id}'
      order by a.item_id, criteria_id
    `, [jobId])
    console.log(res.rows)
    return tasks = { tasks: res.rows }
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch record');
  }
});
