const Boom = require('boom');
const db = require(__base + 'db');

const getAllTasksTimesByJob = (exports.getAllTasksTimesByJob = async id => {
  try {
    let res = await db.query(
      `
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
    times_table.criteria_id`,
      [id]
    );
    console.log(res.rows);
    return (tasks = { tasks: res.rows });
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
    ORDER BY t.worker_id`,
      [id]
    );
    return (workers = { workers: res.rows });
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch record');
  }
});

const getWorkerTimes = (exports.getWorkerTimes = async (jobId, workerId) => {
  try {
    let res = await db.query(
      `
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
    times_table.criteria_id`,
      [jobId, workerId]
    );
    return (tasks = { tasks: res.rows });
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch the record');
  }
});

const getWorkerAnswers = (exports.getWorkerAnswers = async (jobId, workerId) => {
  try {
    let res = await db.query(
      `SELECT id, item_id, (data->'criteria')::json#>>'{0,id}' AS criteria_id, (data->'criteria')::json#>>'{0,workerAnswer}' AS answer
    FROM ${db.TABLES.Task} 
    WHERE worker_id=$2 AND job_id=$1 AND (data->'answered')='true'`,
      [jobId, workerId]
    );
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
      [id]
    );
    return (tasks = { tasks: res.rows });
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch record');
  }
});

const getWorkersAgreements = (exports.getWorkersAgreements = async jobId => {
  try {
    let res = await db.query(
      `
      SELECT item_id,(data->'criteria')::json#>>'{0,id}' AS criteria_id,worker_id,(data->'criteria')::json#>>'{0,workerAnswer}' AS answer
      FROM ${db.TABLES.Task}
      WHERE job_id=$1 AND (data->'answered')='true'
    `,
      [jobId]
    );
    return (tasks = { tasks: res.rows });
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch record');
  }
});

const getCrowdGolds = (exports.getCrowdGolds = async jobId => {
  try {
    let res = await db.query(
      `
      select distinct a.item_id, cast((a.data->'criteria')::json#>>'{0,id}' as bigint) as criteria_id,
        (
          select (b.data->'criteria')::json#>>'{0,workerAnswer}' as answer
          from ${db.TABLES.Task} b
          where b.item_id=a.item_id 
          and (b.data->'criteria')::json#>>'{0,id}'=(a.data->'criteria')::json#>>'{0,id}'
          and b.job_id=$1 and (b.data->'answered')='true'
          group by b.item_id, b.data
          order by count(*) desc
          limit 1
        ) as answer
      from ${db.TABLES.Task} a
      where a.job_id=$1 and (a.data->'answered')='true'
      group by a.item_id, a.data,(a.data->'criteria')::json#>>'{0,id}'
      order by a.item_id, criteria_id
    `,
      [jobId]
    );
    return (tasks = { tasks: res.rows });
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch record');
  }
});

const getWorkersPairs = (exports.getWorkersPairs = async jobId => {
  try {
    var workersCouples = [];
    const query = await db.query(
      `
    select distinct t.worker_id, r.worker_id, u.turk_id as wa, v.turk_id as wb,
      sum(case when (t.data->'criteria')::json#>>'{0,workerAnswer}'<>crowd.answer or (r.data->'criteria')::json#>>'{0,workerAnswer}'<>crowd.answer then 1 else 0 end) as one_mistake,
      count((crowd.item_id,crowd.criteria_id)) as common_tasks,
      greatest(count(distinct (r.data->'criteria')::json#>>'{0,workerAnswer}'), count(distinct (t.data->'criteria')::json#>>'{0,workerAnswer}')) as distinct_answers,
--        (select count(*)
--        from task a 
--        where a.worker_id=t.worker_id and a.job_id=$1
--        ) as wa_tasks,
--        (select count(*)
--        from task b
--        where b.worker_id=r.worker_id and b.job_id=$1
--        ) as wb_tasks,
      sum(case when (t.data->'criteria')::json#>>'{0,workerAnswer}'='yes' and (r.data->'criteria')::json#>>'{0,workerAnswer}'='yes' then 1 else 0 end) as yes_yes,
      sum(case when (t.data->'criteria')::json#>>'{0,workerAnswer}'='yes' and (r.data->'criteria')::json#>>'{0,workerAnswer}'='no' then 1 else 0 end) as yes_no,
      sum(case when (t.data->'criteria')::json#>>'{0,workerAnswer}'='no' and (r.data->'criteria')::json#>>'{0,workerAnswer}'='yes' then 1 else 0 end) as no_yes,
      sum(case when (t.data->'criteria')::json#>>'{0,workerAnswer}'='no' and (r.data->'criteria')::json#>>'{0,workerAnswer}'='no' then 1 else 0 end) as no_no,
      sum(case when (t.data->'criteria')::json#>>'{0,workerAnswer}'<>crowd.answer and (r.data->'criteria')::json#>>'{0,workerAnswer}'<>crowd.answer then 1 else 0 end) as both_mistake,
      sum(case when (r.data->'criteria')::json#>>'{0,workerAnswer}'<>crowd.answer then 1 else 0 end) as b_mistake,
      sum(case when (t.data->'criteria')::json#>>'{0,workerAnswer}'<>crowd.answer then 1 else 0 end) as a_mistake
    from task t, task r, worker u, worker v, (
      select a.item_id, (a.data->'criteria')::json#>>'{0,id}' as criteria_id,
        (select (b.data->'criteria')::json#>>'{0,workerAnswer}'
        from task b
        where b.item_id=a.item_id and b.job_id=$1 and (b.data->'answered')='true'
        --and b.worker_id not in (select * from excluded)
        group by b.item_id,(b.data->'criteria')::json#>>'{0,id}',(b.data->'criteria')::json#>>'{0,workerAnswer}'
        order by count(*) desc
        limit 1) as answer
      from task a
      where a.job_id=$1 and (a.data->'answered')='true'
      --where a.worker_id not in (select * from excluded)
      group by a.item_id, (a.data->'criteria')::json#>>'{0,id}'
      order by a.item_id, (a.data->'criteria')::json#>>'{0,id}'
      ) as crowd
    where t.worker_id<>r.worker_id and t.job_id=$1 and r.job_id=$1 and t.worker_id<r.worker_id
    and t.item_id=r.item_id and (t.data->'criteria')::json#>>'{0,id}'=(r.data->'criteria')::json#>>'{0,id}'
    and (t.data->'answered')='true' and (r.data->'answered')='true'
    and u.id=t.worker_id and v.id=r.worker_id
    and crowd.item_id=t.item_id and (t.data->'criteria')::json#>>'{0,id}'=crowd.criteria_id
    --and t.worker_id not in (select * from excluded) and r.worker_id not in (select * from excluded)
    group by t.worker_id, r.worker_id, u.turk_id, v.turk_id
    order by t.worker_id, r.worker_id
    `,
      [jobId]
    );

    for (var x in query.rows) {
      /*const query2 = await db.query(`
        select t.worker_id as wa, r.worker_id as wb, t.item_id, (t.data->'criteria')::json#>>'{0,id}' as criteria_id,
          (t.data->'criteria')::json#>>'{0,workerAnswer}' as aa, 
          (r.data->'criteria')::json#>>'{0,workerAnswer}' as ab
        from task t, task r, worker u, worker v
        where t.item_id=r.item_id and (t.data->'criteria')::json#>>'{0,id}'=(r.data->'criteria')::json#>>'{0,id}' and t.job_id=$1 and r.job_id=$1
        and (t.data->'answered')='true' and (t.data->'answered')='true'
        and u.id=t.worker_id and v.id=r.worker_id
        and t.worker_id<r.worker_id and u.turk_id='${query.rows[x].wa}' and v.turk_id='${query.rows[x].wb}'
        order by wa, wb`,[jobId]);
      
      var concordant = 0
      var discordant = 0
      for(var y in query2.rows) {
        for(var z in query2.rows) {
          if(query2.rows[y].aa==query2.rows[z].ab) {
            concordant += 1
          } else {
            discordant += 1
          }
        }
      }*/

      var p_yes =
        ((Number(query.rows[x].yes_yes) + Number(query.rows[x].yes_no)) / query.rows[x].common_tasks) *
        ((Number(query.rows[x].yes_yes) + Number(query.rows[x].no_yes)) / query.rows[x].common_tasks);
      var p_no =
        ((Number(query.rows[x].no_no) + Number(query.rows[x].no_yes)) / query.rows[x].common_tasks) *
        ((Number(query.rows[x].no_no) + Number(query.rows[x].yes_no)) / query.rows[x].common_tasks);
      var p_o = (Number(query.rows[x].yes_yes) + Number(query.rows[x].no_no)) / query.rows[x].common_tasks;
      var p_e = Number(p_yes) + Number(p_no);

      //var diff = Number(query.rows[x].wa_tasks)/Number(query.rows[x].wb_tasks)

      let workerCouple = {
        'worker A': query.rows[x].wa,
        'worker B': query.rows[x].wb,
        'common tasks': Number(query.rows[x].common_tasks),
        'both vote wrong': Number(query.rows[x].both_mistake),
        'both vote right': Number(query.rows[x].common_tasks) - Number(query.rows[x].one_mistake),
        "cohen's kappa correlation": query.rows[x].common_tasks == 0 || p_e == 1 ? 0 : Number(((p_o - p_e) / (1 - p_e)).toFixed(3)),
        'probability in errors(a|b)': query.rows[x].b_mistake == 0 ? 0 : Number((query.rows[x].both_mistake / query.rows[x].b_mistake).toFixed(3)),
        'probability in errors(b|a)': query.rows[x].a_mistake == 0 ? 0 : Number((query.rows[x].both_mistake / query.rows[x].a_mistake).toFixed(3)),
        'basic agreement':
          query.rows[x].common_tasks == 0 || query.rows[x].distinct_answers == 1
            ? 0
            : Number(((Number(query.rows[x].yes_yes) + Number(query.rows[x].no_no)) / Number(query.rows[x].common_tasks)).toFixed(3)),
        "bennett's s": Number(((Number(p_o.toFixed(5)) - 0.5) / (1 - 0.5)).toFixed(3))
        /*'kendall\'s t': 
          query.rows[x].common_tasks==1 ?
            Number(((concordant - discordant)
              / (Number(query.rows[x].common_tasks))
            ).toFixed(3))
          : 
          concordant>=(2*discordant) ? 1 :
          discordant>=(2*concordant) ? -1 :
            Number(((concordant - discordant)
              / (Number(query.rows[x].common_tasks)*Number(query.rows[x].common_tasks-1)/2)
            ).toFixed(3))*/
      };
      workersCouples.push(workerCouple);
    }
    return (tasks = { tasks: workersCouples });
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch record');
  }
});

const singleWorker = (exports.singleWorker = async (jobId, workerId) => {
  try {
    var workersCouples = [];
    var query = await db.query(
      `select u.turk_id, t.worker_id, 
        sum(case when (t.data->'criteria')::json#>>'{0,workerAnswer}'<>g.gold and crowd.answer<>g.gold then 1 else 0 end) as votes_as_crowd, 
        sum(case when crowd.answer<>g.gold then 1 else 0 end) as votes_on_wronglyclassified,
        sum(case when ((t.data->'criteria')::json#>>'{0,workerAnswer}')=crowd.answer then 1 else 0 end) as rights,
        sum(case when ((t.data->'criteria')::json#>>'{0,workerAnswer}')=g.gold then 1 else 0 end) as right_by_gold,
        count((t.item_id, (t.data->'criteria')::json#>>'{0,id}')) as voted_tasks
      from task t, worker u, gold g, (
        select a.item_id, (a.data->'criteria')::json#>>'{0,id}' as criteria_id,
          (select (b.data->'criteria')::json#>>'{0,workerAnswer}'
          from task b
          where b.item_id=a.item_id and (b.data->'answered')='true'
          --and b.worker_id not in (select * from excluded) and b.job_id=$1
          group by b.item_id,(b.data->'criteria')::json#>>'{0,id}',(b.data->'criteria')::json#>>'{0,workerAnswer}'
          order by count(*) desc
          limit 1) as answer
        from task a
        where a.job_id=$1 and (a.data->'answered')='true'
        --and a.worker_id not in (select * from excluded)
        group by a.item_id, (a.data->'criteria')::json#>>'{0,id}'
        order by a.item_id, (a.data->'criteria')::json#>>'{0,id}'
        ) as crowd
      where t.item_id=crowd.item_id and g.item_id=t.item_id and u.id=t.worker_id
      and t.job_id=$1 and u.turk_id=$2 and (t.data->'answered')='true'
      and crowd.criteria_id=(t.data->'criteria')::json#>>'{0,id}' 
      and g.criteria_id=cast((t.data->'criteria')::json#>>'{0,id}' as bigint)
      --and t.worker_id not in (select * from excluded)
      group by t.worker_id, u.turk_id
      order by t.worker_id`,
      [jobId, workerId]
    );

    for (var x in query.rows) {
      let workerCouple = {
        'worker A': query.rows[x].turk_id,
        id: query.rows[x].worker_id,
        'number of completed tasks': Number(query.rows[x].voted_tasks),
        'times voted right comparing with crowd truth': Number(query.rows[x].rights),
        'times voted right comparing with gold truth': Number(query.rows[x].right_by_gold),
        //'votes as crowd': Number(query.rows[x].votes_as_crowd),
        'votes on wrongly classified tasks': Number(query.rows[x].votes_on_wronglyclassified),
        'contribution to crowd error':
          query.rows[x].votes_on_wronglyclassified == 0
            ? 0
            : (query.rows[x].votes_as_crowd / query.rows[x].votes_on_wronglyclassified).toFixed(5) * 100,
        'precision toward gold truth': (Number(query.rows[x].right_by_gold) / Number(query.rows[x].voted_tasks)).toFixed(5) * 100
      };
      workersCouples.push(workerCouple);
    }
    return (tasks = { tasks: workersCouples });
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch record');
  }
});

const contribution = (exports.contribution = async jobId => {
  try {
    var workersCouples = [];
    var query = await db.query(
      `select u.turk_id, t.worker_id, 
        sum(case when (t.data->'criteria')::json#>>'{0,workerAnswer}'<>g.gold and crowd.answer<>g.gold then 1 else 0 end) as votes_as_crowd, 
        sum(case when crowd.answer<>g.gold then 1 else 0 end) as votes_on_wronglyclassified,
        sum(case when ((t.data->'criteria')::json#>>'{0,workerAnswer}')=crowd.answer then 1 else 0 end) as rights,
        count((t.item_id, (t.data->'criteria')::json#>>'{0,id}')) as voted_tasks
      from task t, worker u, gold g, (
        select a.item_id, (a.data->'criteria')::json#>>'{0,id}' as criteria_id,
          (select (b.data->'criteria')::json#>>'{0,workerAnswer}'
          from task b
          where b.item_id=a.item_id and (b.data->'answered')='true'
          --and b.worker_id not in (select * from excluded) and b.job_id=$1
          group by b.item_id,(b.data->'criteria')::json#>>'{0,id}',(b.data->'criteria')::json#>>'{0,workerAnswer}'
          order by count(*) desc
          limit 1) as answer
        from task a
        where a.job_id=$1 and (a.data->'answered')='true'
        --and a.worker_id not in (select * from excluded)
        group by a.item_id, (a.data->'criteria')::json#>>'{0,id}'
        order by a.item_id, (a.data->'criteria')::json#>>'{0,id}'
        ) as crowd
      where t.item_id=crowd.item_id and g.item_id=t.item_id and t.job_id=$1
      and u.id=t.worker_id and (t.data->'answered')='true'
      and crowd.criteria_id=(t.data->'criteria')::json#>>'{0,id}' 
      and g.criteria_id=cast((t.data->'criteria')::json#>>'{0,id}' as bigint)
      --and t.worker_id not in (select * from excluded)
      group by t.worker_id, u.turk_id
      order by t.worker_id`,
      [jobId]
    );

    for (var x in query.rows) {
      let workerCouple = {
        'worker A': query.rows[x].turk_id,
        id: query.rows[x].worker_id,
        //'votes on wrongly classified tasks': Number(query.rows[x].votes_on_wronglyclassified),
        'number of completed tasks': Number(query.rows[x].voted_tasks),
        'precision toward crowd truth': Number((Number(query.rows[x].rights) / Number(query.rows[x].voted_tasks)).toFixed(5) * 100),
        'contribution to crowd error':
          query.rows[x].votes_on_wronglyclassified == 0
            ? 0
            : (query.rows[x].votes_as_crowd / query.rows[x].votes_on_wronglyclassified).toFixed(4) * 100
      };
      workersCouples.push(workerCouple);
    }
    return (tasks = { tasks: workersCouples });
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch record');
  }
});

const jobStats = (exports.jobStats = async jobId => {
  try {
    var jobRows = [];
    var query = await db.query(
      `
      select t.item_id,
        sum(case when (t.data->'criteria')::json#>>'{0,workerAnswer}'='yes' and g.gold='yes' then 1 else 0 end) as tp,
        sum(case when (t.data->'criteria')::json#>>'{0,workerAnswer}'='yes' and g.gold='no' then 1 else 0 end) as fp,
        sum(case when (t.data->'criteria')::json#>>'{0,workerAnswer}'='no' and g.gold='yes' then 1 else 0 end) as fn,
        sum(case when (t.data->'criteria')::json#>>'{0,workerAnswer}'='no' and g.gold='no' then 1 else 0 end) as tn
      from task t, gold g,
        (
        select distinct a.item_id, (a.data->'criteria')::json#>>'{0,id}' as criteria_id,
          (select (b.data->'criteria')::json#>>'{0,workerAnswer}' as answer
          from task b
          where b.item_id=a.item_id 
          and (b.data->'criteria')::json#>>'{0,id}'=(a.data->'criteria')::json#>>'{0,id}'
          and b.job_id=$1 and (b.data->'answered')='true'
          --and b.worker_id not in (select * from excluded)
          group by b.item_id, b.data
          order by count(*) desc
          limit 1) as answer
        from task a
        where a.job_id=$1 and (a.data->'answered')='true'
        --where a.worker_id not in (select * from excluded)
        group by a.item_id, a.data,(a.data->'criteria')::json#>>'{0,id}'
        order by a.item_id, (a.data->'criteria')::json#>>'{0,id}'
        ) as crowd
      where t.item_id=g.item_id and (t.data->'criteria')::json#>>'{0,id}'=cast(g.criteria_id as text)
      and t.item_id=crowd.item_id and (t.data->'criteria')::json#>>'{0,id}'=crowd.criteria_id
      and t.job_id=$1 and (t.data->'answered')='true'
      group by t.item_id
      order by t.item_id
    `,
      [jobId]
    );

    for (var x in query.rows) {
      var p = Number(query.rows[x].tp) / (Number(query.rows[x].tp) + Number(query.rows[x].fp));
      var r = Number(query.rows[x].tp) / (Number(query.rows[x].fn) + Number(query.rows[x].tp));
      let row = {
        item_id: query.rows[x].item_id,
        job_id: jobId,
        'F1-score':
          Number(query.rows[x].fn) + Number(query.rows[x].tp) == 0 || Number(query.rows[x].tp) + Number(query.rows[x].fp) == 0
            ? 1
            : Number(((2 * p * r) / (p + r)).toFixed(3)),
        'Diagnostic Odds Ratio':
          Number(query.rows[x].fp) * Number(query.rows[x].fn) == 0
            ? 1
            : Number(((Number(query.rows[x].tp) * Number(query.rows[x].tn)) / (Number(query.rows[x].fp) * Number(query.rows[x].fn))).toFixed(3)),
        Sensitivity:
          Number(query.rows[x].tp) + Number(query.rows[x].tn) == 0
            ? 1
            : Number((Number(query.rows[x].tp) / (Number(query.rows[x].tp) + Number(query.rows[x].tn))).toFixed(3)),
        Specificity:
          Number(query.rows[x].fp) + Number(query.rows[x].tn) == 0
            ? 1
            : Number((Number(query.rows[x].tn) / (Number(query.rows[x].fp) + Number(query.rows[x].tn))).toFixed(3)),
        "Youden's J":
          Number(query.rows[x].fp) + Number(query.rows[x].tn) == 0 || Number(query.rows[x].tp) + Number(query.rows[x].tn) == 0
            ? 1
            : Number(
                (
                  Number(query.rows[x].tp) / (Number(query.rows[x].tp) + Number(query.rows[x].tn)) +
                  Number(query.rows[x].tn) / (Number(query.rows[x].fp) + Number(query.rows[x].tn)) -
                  1
                ).toFixed(3)
              ),
        'Matthews Correlation Coefficient':
          Math.sqrt(
            (Number(query.rows[x].tp) + Number(query.rows[x].fp)) *
              (Number(query.rows[x].tp) + Number(query.rows[x].fn)) *
              (Number(query.rows[x].tn) + Number(query.rows[x].fp)) *
              (Number(query.rows[x].tn) + Number(query.rows[x].fn))
          ) == 0
            ? 1
            : Number(
                (
                  (Number(query.rows[x].tp) * Number(query.rows[x].tn) - Number(query.rows[x].fp) * Number(query.rows[x].fn)) /
                  Math.sqrt(
                    (Number(query.rows[x].tp) + Number(query.rows[x].fp)) *
                      (Number(query.rows[x].tp) + Number(query.rows[x].fn)) *
                      (Number(query.rows[x].tn) + Number(query.rows[x].fp)) *
                      (Number(query.rows[x].tn) + Number(query.rows[x].fn))
                  )
                ).toFixed(3)
              )
      };
      jobRows.push(row);
    }
    return (tasks = { tasks: jobRows });
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch record');
  }
});
