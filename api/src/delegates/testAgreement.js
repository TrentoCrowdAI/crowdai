const Boom = require('boom');

const db = require(__base + 'db');

const getByJobId = (exports.getByJobId = async id => {
  try {
    let res = await db.query(
      `
    select item_id, (data->'criteria')::json#>>'{0,id}' as criteria_id, count(*) as num_tasks
    from ${db.TABLES.Task_7500} 
    where job_id=$1
    group by item_id,(data->'criteria')::json#>>'{0,id}'
    order by item_id,(data->'criteria')::json#>>'{0,id}'`,
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
      `select item_id, count(*) as num_tasks
    from ${db.TABLES.Task_7500} where worker_id=$1 
    group by item_id`,
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

const allPossibleCouplesOfWorkersAndNumberOfCommonTask = (exports.allPossibleCouplesOfWorkersAndNumberOfCommonTask = async () => {
  try {
    let res = await db.query(
      `select distinct t.worker_id as worker_a, r.worker_id as worker_b, count((t.item_id, (r.data->'criteria')::json#>>'{0,id}')) as common_tasks 
      from task_test_7500 t join task_test_7500 r on t.item_id=r.item_id and (t.data->'criteria')::json#>>'{0,id}'=(r.data->'criteria')::json#>>'{0,id}' 
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
      `select distinct t.worker_id as worker_a, r.worker_id as worker_b, count((t.item_id, (r.data->'criteria')::json#>>'{0,id}')) as common_tasks, (select count(*) 
      from task_test_7500 a join task_test_7500 b on a.item_id=b.item_id and (a.data->'criteria')::json#>>'{0,id}'=(b.data->'criteria')::json#>>'{0,id}' where a.worker_id=t.worker_id and b.worker_id=r.worker_id and a.data->'end' is not null and b.data->'end' is not null and (a.data->'criteria')::json#>>'{0,workerAnswer}'=(b.data->'criteria')::json#>>'{0,workerAnswer}') as same_responses from task_test_7500 t join task_test_7500 r on t.item_id=r.item_id and (t.data->'criteria')::json#>>'{0,id}'=(r.data->'criteria')::json#>>'{0,id}' 
      where t.worker_id<>r.worker_id and t.data->'end' is not null and r.data->'end' is not null and t.worker_id='1' group by t.worker_id,r.worker_id order by same_responses desc`
    );
    return res.rows;
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch record');
  }
});

