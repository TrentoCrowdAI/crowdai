const Boom = require('boom');

const db = require(__base + 'db');

const getByJobId = (exports.getByJobId = async id => {
  try {
    let res = await db.query(
      `
    SELECT item_id, (data->'criteria')::json#>>'{0,id}' AS criteria_id, count(*) AS num_tasks
    FROM ${db.TABLES.Task} 
    WHERE job_id=$1 AND (data->'end') IS NOT NULL
    GROUP BY item_id,(data->'criteria')::json#>>'{0,id}'
    ORDER BY item_id,(data->'criteria')::json#>>'{0,id}'`,
      [id]
    );
    return (tasks = { tasks: res.rows });
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch the record');
  }
});

const getTaskByWorkerId = (exports.getTaskByWorkerId = async id => {
  try {
    let res = await db.query(
      `SELECT item_id, count(*) AS num_tasks
    FROM ${db.TABLES.Task}
    WHERE worker_id=$1 AND (data->'end') IS NOT NULL
    GROUP BY item_id`,
      [id]
    );
    return (tasks = { tasks: res.rows });
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch the record');
  }
});

const workerAnswers = (exports.workerAnswers = async id => {
  try {
    let res = await db.query(
      `SELECT id, item_id, (data->'criteria')::json#>>'{0,id}' AS criteria_id, (data->'criteria')::json#>>'{0,workerAnswer}' AS answer
    FROM ${db.TABLES.Task} 
    WHERE worker_id=$1 AND (data->'end') IS NOT NULL`,
      [id]
    );
    return (tasks = { tasks: res.rows });
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch record');
  }
});

const allPossibleCouplesOfWorkersAndNumberOfCommonTask = (exports.allPossibleCouplesOfWorkersAndNumberOfCommonTask = async () => {
  try {
    let res = await db.query(
      `select distinct t.worker_id as worker_a, r.worker_id as worker_b, count((t.item_id, (r.data->'criteria')::json#>>'{0,id}')) as common_tasks 
      from ${db.TABLES.Task} t join ${db.TABLES.Task} r on t.item_id=r.item_id and (t.data->'criteria')::json#>>'{0,id}'=(r.data->'criteria')::json#>>'{0,id}' 
      where t.worker_id<>r.worker_id and t.data->'end' is not null and r.data->'end' is not null and t.worker_id='56' group by t.worker_id,r.worker_id order by r.worker_id`
    );
    return res.rows;
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch record');
  }
});

const forASelectedWorkerShowAllWorkers = (exports.forASelectedWorkerShowAllWorkers = async () => {
  try {
    let res = await db.query(
      `SELECT DISTINCT t.worker_id AS worker_a, r.worker_id AS worker_b, 
      COUNT((t.item_id, (r.data->'criteria')::json#>>'{0,id}')) AS common_tasks,
        (SELECT COUNT(*) 
        FROM ${db.TABLES.Task} a JOIN ${db.TABLES.Task} b ON a.item_id=b.item_id AND (a.data->'criteria')::json#>>'{0,id}'=(b.data->'criteria')::json#>>'{0,id}'
        WHERE a.worker_id=t.worker_id AND b.worker_id=r.worker_id
          AND a.data->'end' IS NOT NULL AND b.data->'end' IS NOT NULL
          AND (a.data->'criteria')::json#>>'{0,workerAnswer}'=(b.data->'criteria')::json#>>'{0,workerAnswer}'
        ) AS same_responses
      FROM ${db.TABLES.Task} t JOIN ${db.TABLES.Task} r ON t.item_id=r.item_id AND (t.data->'criteria')::json#>>'{0,id}'=(r.data->'criteria')::json#>>'{0,id}' 
      WHERE t.worker_id<>r.worker_id AND t.data->'end' IS NOT NULL and r.data->'end' IS NOT NULL and t.worker_id='1'
      GROUP BY t.worker_id,r.worker_id
      ORDER BY same_responses DESC`
    );
    return res.rows;
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch record');
  }
});

