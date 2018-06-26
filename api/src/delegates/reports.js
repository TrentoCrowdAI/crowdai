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
      `SELECT u.turk_id, t.item_id, 
        EXTRACT( EPOCH FROM (t.created_at)::TIMESTAMP WITHOUT TIME ZONE) AS delivery, 
        (t.data->'criteria')::json#>>'{0,id}' AS criteria_id, 
        (t.data->'criteria')::json#>>'{0,workerAnswer}' AS answer,
        (CASE WHEN g.gold=(t.data->'criteria')::json#>>'{0,workerAnswer}' THEN true ELSE false END) AS correct
    FROM ${db.TABLES.Task} t, ${db.TABLES.Worker} u, ${db.TABLES.Gold} g
    WHERE t.worker_id=u.id
    AND g.item_id=t.item_id AND g.criteria_id=cast((t.data->'criteria')::json#>>'{0,id}' AS bigint)
    AND t.worker_id=$2 AND t.job_id=$1 AND (t.data->'answered')='true'`,
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
      SELECT DISTINCT a.item_id, cast((a.data->'criteria')::json#>>'{0,id}' AS bigint) AS criteria_id,
        (
          SELECT (b.data->'criteria')::json#>>'{0,workerAnswer}' AS answer
          FROM ${db.TABLES.Task} b
          WHERE b.item_id=a.item_id 
          AND (b.data->'criteria')::json#>>'{0,id}'=(a.data->'criteria')::json#>>'{0,id}'
          AND b.job_id=$1 AND (b.data->'answered')='true'
          GROUP BY b.item_id, b.data
          ORDER BY COUNT(*) desc
          limit 1
        ) AS answer
      FROM ${db.TABLES.Task} a
      WHERE a.job_id=$1 AND (a.data->'answered')='true'
      GROUP BY a.item_id, a.data,(a.data->'criteria')::json#>>'{0,id}'
      ORDER BY a.item_id, criteria_id
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
    SELECT DISTINCT t.worker_id, r.worker_id, u.turk_id AS wa, v.turk_id AS wb,
      SUM(CASE WHEN (t.data->'criteria')::json#>>'{0,workerAnswer}'<>crowd.answer OR (r.data->'criteria')::json#>>'{0,workerAnswer}'<>crowd.answer THEN 1 ELSE 0 END) AS one_mistake,
      COUNT((crowd.item_id,crowd.criteria_id)) AS common_tasks,
      GREATEST(COUNT(DISTINCT (r.data->'criteria')::json#>>'{0,workerAnswer}'), COUNT(DISTINCT (t.data->'criteria')::json#>>'{0,workerAnswer}')) AS distinct_answers,
--        (SELECT COUNT(*)
--        FROM ${db.TABLES.Task} a 
--        WHERE a.worker_id=t.worker_id AND a.job_id=$1
--        ) AS wa_tasks,
--        (SELECT COUNT(*)
--        FROM ${db.TABLES.Task} b
--        WHERE b.worker_id=r.worker_id AND b.job_id=$1
--        ) AS wb_tasks,
      SUM(CASE WHEN (t.data->'criteria')::json#>>'{0,workerAnswer}'='yes' AND (r.data->'criteria')::json#>>'{0,workerAnswer}'='yes' THEN 1 ELSE 0 END) AS yes_yes,
      SUM(CASE WHEN (t.data->'criteria')::json#>>'{0,workerAnswer}'='yes' AND (r.data->'criteria')::json#>>'{0,workerAnswer}'='no' THEN 1 ELSE 0 END) AS yes_no,
      SUM(CASE WHEN (t.data->'criteria')::json#>>'{0,workerAnswer}'='no' AND (r.data->'criteria')::json#>>'{0,workerAnswer}'='yes' THEN 1 ELSE 0 END) AS no_yes,
      SUM(CASE WHEN (t.data->'criteria')::json#>>'{0,workerAnswer}'='no' AND (r.data->'criteria')::json#>>'{0,workerAnswer}'='no' THEN 1 ELSE 0 END) AS no_no,
      SUM(CASE WHEN (t.data->'criteria')::json#>>'{0,workerAnswer}'<>crowd.answer AND (r.data->'criteria')::json#>>'{0,workerAnswer}'<>crowd.answer THEN 1 ELSE 0 END) AS both_mistake,
      SUM(CASE WHEN (r.data->'criteria')::json#>>'{0,workerAnswer}'<>crowd.answer THEN 1 ELSE 0 END) AS b_mistake,
      SUM(CASE WHEN (t.data->'criteria')::json#>>'{0,workerAnswer}'<>crowd.answer THEN 1 ELSE 0 END) AS a_mistake
    FROM ${db.TABLES.Task} t, ${db.TABLES.Task} r, ${db.TABLES.Worker} u, ${db.TABLES.Worker} v, (
      SELECT a.item_id, (a.data->'criteria')::json#>>'{0,id}' AS criteria_id,
        (SELECT (b.data->'criteria')::json#>>'{0,workerAnswer}'
        FROM ${db.TABLES.Task} b
        WHERE b.item_id=a.item_id AND b.job_id=$1 AND (b.data->'answered')='true'
        --AND b.worker_id NOT IN (SELECT * FROM ${db.TABLES.Excluded})
        GROUP BY b.item_id,(b.data->'criteria')::json#>>'{0,id}',(b.data->'criteria')::json#>>'{0,workerAnswer}'
        ORDER BY COUNT(*) desc
        limit 1) AS answer
      FROM ${db.TABLES.Task} a
      WHERE a.job_id=$1 AND (a.data->'answered')='true'
      --WHERE a.worker_id NOT IN (SELECT * FROM ${db.TABLES.Excluded})
      GROUP BY a.item_id, (a.data->'criteria')::json#>>'{0,id}'
      ORDER BY a.item_id, (a.data->'criteria')::json#>>'{0,id}'
      ) AS crowd
    WHERE t.worker_id<>r.worker_id AND t.job_id=$1 AND r.job_id=$1 AND t.worker_id<r.worker_id
    AND t.item_id=r.item_id AND (t.data->'criteria')::json#>>'{0,id}'=(r.data->'criteria')::json#>>'{0,id}'
    AND (t.data->'answered')='true' AND (r.data->'answered')='true'
    AND u.id=t.worker_id AND v.id=r.worker_id
    AND crowd.item_id=t.item_id AND (t.data->'criteria')::json#>>'{0,id}'=crowd.criteria_id
    --AND t.worker_id NOT IN (SELECT * FROM ${db.TABLES.Excluded}) AND r.worker_id NOT IN (SELECT * FROM ${db.TABLES.Excluded})
    GROUP BY t.worker_id, r.worker_id, u.turk_id, v.turk_id
    ORDER BY t.worker_id, r.worker_id
    `,
      [jobId]
    );

    for (var x in query.rows) {
      /*const query2 = await db.query(`
        SELECT t.worker_id AS wa, r.worker_id AS wb, t.item_id, (t.data->'criteria')::json#>>'{0,id}' AS criteria_id,
          (t.data->'criteria')::json#>>'{0,workerAnswer}' AS aa, 
          (r.data->'criteria')::json#>>'{0,workerAnswer}' AS ab
        FROM ${db.TABLES.Task} t, ${db.TABLES.Task} r, ${db.TABLES.Worker} u, ${db.TABLES.Worker} v
        WHERE t.item_id=r.item_id AND (t.data->'criteria')::json#>>'{0,id}'=(r.data->'criteria')::json#>>'{0,id}' AND t.job_id=$1 AND r.job_id=$1
        AND (t.data->'answered')='true' AND (t.data->'answered')='true'
        AND u.id=t.worker_id AND v.id=r.worker_id
        AND t.worker_id<r.worker_id AND u.turk_id='${query.rows[x].wa}' AND v.turk_id='${query.rows[x].wb}'
        ORDER BY wa, wb`,[jobId]);
      
      var concordant = 0
      var discordant = 0
      for(var y in query2.rows) {
        for(var z in query2.rows) {
          if(query2.rows[y].aa==query2.rows[z].ab) {
            concordant += 1
          } ELSE {
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

const getSingleWorker = (exports.getSingleWorker = async (jobId, workerId) => {
  try {
    var workersCouples = [];
    var query = await db.query(
      `SELECT u.turk_id, t.worker_id, 
        SUM(CASE WHEN (t.data->'criteria')::json#>>'{0,workerAnswer}'<>g.gold AND crowd.answer<>g.gold THEN 1 ELSE 0 END) AS votes_as_crowd, 
        SUM(CASE WHEN crowd.answer<>g.gold THEN 1 ELSE 0 END) AS votes_on_wronglyclassified,
        SUM(CASE WHEN ((t.data->'criteria')::json#>>'{0,workerAnswer}')=crowd.answer THEN 1 ELSE 0 END) AS rights,
        SUM(CASE WHEN ((t.data->'criteria')::json#>>'{0,workerAnswer}')=g.gold THEN 1 ELSE 0 END) AS right_by_gold,
        COUNT((t.item_id, (t.data->'criteria')::json#>>'{0,id}')) AS voted_tasks
      FROM ${db.TABLES.Task} t, ${db.TABLES.Worker} u, ${db.TABLES.Gold} g, (
        SELECT a.item_id, (a.data->'criteria')::json#>>'{0,id}' AS criteria_id,
          (SELECT (b.data->'criteria')::json#>>'{0,workerAnswer}'
          FROM ${db.TABLES.Task} b
          WHERE b.item_id=a.item_id AND (b.data->'answered')='true'
          --AND b.worker_id NOT IN (SELECT * FROM ${db.TABLES.Excluded}) AND b.job_id=$1
          GROUP BY b.item_id,(b.data->'criteria')::json#>>'{0,id}',(b.data->'criteria')::json#>>'{0,workerAnswer}'
          ORDER BY COUNT(*) desc
          limit 1) AS answer
        FROM ${db.TABLES.Task} a
        WHERE a.job_id=$1 AND (a.data->'answered')='true'
        --AND a.worker_id NOT IN (SELECT * FROM ${db.TABLES.Excluded})
        GROUP BY a.item_id, (a.data->'criteria')::json#>>'{0,id}'
        ORDER BY a.item_id, (a.data->'criteria')::json#>>'{0,id}'
        ) AS crowd
      WHERE t.item_id=crowd.item_id AND g.item_id=t.item_id AND u.id=t.worker_id
      AND t.job_id=$1 AND t.worker_id=$2 AND (t.data->'answered')='true'
      AND crowd.criteria_id=(t.data->'criteria')::json#>>'{0,id}' 
      AND g.criteria_id=cast((t.data->'criteria')::json#>>'{0,id}' AS bigint)
      --AND t.worker_id NOT IN (SELECT * FROM ${db.TABLES.Excluded})
      GROUP BY t.worker_id, u.turk_id
      ORDER BY t.worker_id`,
      [jobId, workerId]
    );

    for (var x in query.rows) {
      let workerCouple = {
        'worker A': query.rows[x].turk_id,
        id: query.rows[x].worker_id,
        'number of completed tasks': Number(query.rows[x].voted_tasks),
        'times voted right comparing with crowd truth': Number(query.rows[x].rights),
        'times voted right comparing with gold truth': Number(query.rows[x].right_by_gold),
        //'votes AS crowd': Number(query.rows[x].votes_as_crowd),
        'votes on wrongly classified tasks': Number(query.rows[x].votes_on_wronglyclassified),
        'contribution to crowd error':
          query.rows[x].votes_on_wronglyclassified == 0
            ? 0
            : (query.rows[x].votes_as_crowd / query.rows[x].votes_on_wronglyclassified).toFixed(5) * 100,
        'precision toward gold truth': (Number(query.rows[x].right_by_gold) / Number(query.rows[x].voted_tasks)).toFixed(5) * 100
      };
      //console.log(query.rows)
      workersCouples.push(workerCouple);
    }
    return (tasks = { tasks: workersCouples });
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch record');
  }
});

const getContribution = (exports.getContribution = async jobId => {
  try {
    var workersCouples = [];
    var query = await db.query(
      `SELECT u.turk_id, t.worker_id, 
        SUM(CASE WHEN (t.data->'criteria')::json#>>'{0,workerAnswer}'<>g.gold AND crowd.answer<>g.gold THEN 1 ELSE 0 END) AS votes_as_crowd, 
        SUM(CASE WHEN crowd.answer<>g.gold THEN 1 ELSE 0 END) AS votes_on_wronglyclassified,
        SUM(CASE WHEN ((t.data->'criteria')::json#>>'{0,workerAnswer}')=crowd.answer THEN 1 ELSE 0 END) AS rights,
        COUNT((t.item_id, (t.data->'criteria')::json#>>'{0,id}')) AS voted_tasks
      FROM ${db.TABLES.Task} t, ${db.TABLES.Worker} u, ${db.TABLES.Gold} g, (
        SELECT a.item_id, (a.data->'criteria')::json#>>'{0,id}' AS criteria_id,
          (SELECT (b.data->'criteria')::json#>>'{0,workerAnswer}'
          FROM ${db.TABLES.Task} b
          WHERE b.item_id=a.item_id AND (b.data->'answered')='true'
          --AND b.worker_id NOT IN (SELECT * FROM ${db.TABLES.Excluded}) AND b.job_id=$1
          GROUP BY b.item_id,(b.data->'criteria')::json#>>'{0,id}',(b.data->'criteria')::json#>>'{0,workerAnswer}'
          ORDER BY COUNT(*) desc
          limit 1) AS answer
        FROM ${db.TABLES.Task} a
        WHERE a.job_id=$1 AND (a.data->'answered')='true'
        --AND a.worker_id NOT IN (SELECT * FROM ${db.TABLES.Excluded})
        GROUP BY a.item_id, (a.data->'criteria')::json#>>'{0,id}'
        ORDER BY a.item_id, (a.data->'criteria')::json#>>'{0,id}'
        ) AS crowd
      WHERE t.item_id=crowd.item_id AND g.item_id=t.item_id AND t.job_id=$1
      AND u.id=t.worker_id AND (t.data->'answered')='true'
      AND crowd.criteria_id=(t.data->'criteria')::json#>>'{0,id}' 
      AND g.criteria_id=cast((t.data->'criteria')::json#>>'{0,id}' AS bigint)
      --AND t.worker_id NOT IN (SELECT * FROM ${db.TABLES.Excluded})
      GROUP BY t.worker_id, u.turk_id
      ORDER BY t.worker_id`,
      [jobId]
    );

    for (var x in query.rows) {
      let workerCouple = {
        'worker A': query.rows[x].turk_id,
        'id': query.rows[x].worker_id,
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

const getJobStats = (exports.getJobStats = async jobId => {
  try {
    var jobRows = [];
    var query = await db.query(
      `
      SELECT t.item_id,
        SUM(CASE WHEN (t.data->'criteria')::json#>>'{0,workerAnswer}'='yes' AND g.gold='yes' THEN 1 ELSE 0 END) AS tp,
        SUM(CASE WHEN (t.data->'criteria')::json#>>'{0,workerAnswer}'='yes' AND g.gold='no' THEN 1 ELSE 0 END) AS fp,
        SUM(CASE WHEN (t.data->'criteria')::json#>>'{0,workerAnswer}'='no' AND g.gold='yes' THEN 1 ELSE 0 END) AS fn,
        SUM(CASE WHEN (t.data->'criteria')::json#>>'{0,workerAnswer}'='no' AND g.gold='no' THEN 1 ELSE 0 END) AS tn
      FROM ${db.TABLES.Task} t, ${db.TABLES.Gold} g,
        (
        SELECT DISTINCT a.item_id, (a.data->'criteria')::json#>>'{0,id}' AS criteria_id,
          (SELECT (b.data->'criteria')::json#>>'{0,workerAnswer}' AS answer
          FROM ${db.TABLES.Task} b
          WHERE b.item_id=a.item_id 
          AND (b.data->'criteria')::json#>>'{0,id}'=(a.data->'criteria')::json#>>'{0,id}'
          AND b.job_id=$1 AND (b.data->'answered')='true'
          --AND b.worker_id NOT IN (SELECT * FROM ${db.TABLES.Excluded})
          GROUP BY b.item_id, b.data
          ORDER BY COUNT(*) desc
          limit 1) AS answer
        FROM ${db.TABLES.Task} a
        WHERE a.job_id=$1 AND (a.data->'answered')='true'
        --WHERE a.worker_id NOT IN (SELECT * FROM ${db.TABLES.Excluded})
        GROUP BY a.item_id, a.data,(a.data->'criteria')::json#>>'{0,id}'
        ORDER BY a.item_id, (a.data->'criteria')::json#>>'{0,id}'
        ) AS crowd
      WHERE t.item_id=g.item_id AND (t.data->'criteria')::json#>>'{0,id}'=cast(g.criteria_id AS text)
      AND t.item_id=crowd.item_id AND (t.data->'criteria')::json#>>'{0,id}'=crowd.criteria_id
      AND t.job_id=$1 AND (t.data->'answered')='true'
      GROUP BY t.item_id
      ORDER BY t.item_id
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
