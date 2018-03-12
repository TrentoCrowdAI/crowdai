const Boom = require('boom');
const uuid = require('uuid/v4');
const request = require('request');
const parse = require('csv-parse');
const transform = require('stream-transform');
const CronJob = require('cron').CronJob;

const config = require(__base + 'config');
const db = require(__base + 'db');
const tasksDelegate = require('./tasks');
const requestersDelegate = require('./requesters');
const MTurk = require(__base + 'utils/mturk');
const workersDelegate = require('./workers');
const projectsDelegate = require('./projects');

const ExperimentStatus = Object.freeze({
  NOT_PUBLISHED: 'NOT_PUBLISHED',
  PUBLISHED: 'PUBLISHED',
  DONE: 'DONE'
});

const getByProject = (exports.getByProject = async projectId => {
  try {
    let res = await db.query(
      `select * from ${db.TABLES.Experiment} where project_id = $1`,
      [projectId]
    );
    return { rows: res.rows, meta: { count: res.rowCount } };
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch records');
  }
});

const getById = (exports.getById = async id => {
  try {
    let res = await db.query(
      `select * from ${db.TABLES.Experiment} where id = $1`,
      [id]
    );
    return res.rows[0];
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch the record');
  }
});

const getByUuid = (exports.getByUuid = async uuid => {
  try {
    let res = await db.query(
      `select * from ${db.TABLES.Experiment} where uuid = $1`,
      [uuid]
    );
    return res.rows[0];
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch the record');
  }
});

/**
 * Get the requester associated with the experiment.
 *
 * @param {Number} id - The experiment ID
 * @returns {Object}
 */
const getRequester = (exports.getRequester = async id => {
  try {
    let res = await db.query(
      `select r.* from ${db.TABLES.Experiment} e join ${
        db.TABLES.Project
      } p on e.project_id = p.id join ${
        db.TABLES.Requester
      } r on p.requester_id = r.id  where e.id = $1`,
      [id]
    );
    return res.rows[0];
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch the record');
  }
});

const create = (exports.create = async experiment => {
  try {
    await db.query('BEGIN');
    let res = await db.query(
      `insert into ${
        db.TABLES.Experiment
      }(project_id, uuid, created_at, data) values($1, $2, $3, $4) returning *`,
      [experiment.project_id, uuid(), new Date(), experiment.data]
    );
    const saved = res.rows[0];
    await db.query('COMMIT');
    return saved;
  } catch (error) {
    await db.query('ROLLBACK');
    console.error(error);
    throw Boom.badImplementation('Error while trying to persist the record');
  }
});

/**
 * Updates the given experiment. We only update the data column.
 *
 * @param {Number} id - The experiment's ID.
 * @param {Object} experimentData - Attributes to update in data column
 */
const update = (exports.update = async (id, experimentData) => {
  try {
    let saved = await getById(id);
    let data = {
      ...saved.data,
      ...experimentData
    };
    let res = await db.query(
      `update ${
        db.TABLES.Experiment
      } set updated_at = $1, data = $2 where id = $3 returning *`,
      [new Date(), data, id]
    );
    return res.rows[0];
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to update the record');
  }
});

/**
 * Publish the experiment on Amazon Mechanical Turk.
 *
 * @param {Number} id - The experiment ID.
 * @returns {Object} - The experiment with its status updated.
 */
const publish = (exports.publish = async id => {
  try {
    let requester = await getRequester(id);
    let experiment = await getById(id);
    const experimentUrl = `${config.frontend.url}/#/welcome/${experiment.uuid}`;
    const mt = MTurk.getInstance(requester);
    let params = {
      Description: experiment.data.description,
      Reward: `${experiment.data.taskRewardRule}`,
      Title: experiment.data.name,
      MaxAssignments: experiment.data.hitConfig.maxAssignments,
      Question: `${MTurk.getExternalQuestionPayload(experimentUrl)}`,
      RequesterAnnotation: experiment.data.name,
      LifetimeInSeconds: experiment.data.hitConfig.lifetimeInMinutes * 60,
      AssignmentDurationInSeconds:
        experiment.data.hitConfig.assignmentDurationInMinutes * 60
    };

    console.log(`Creating HIT on Amazon Mechanical Turk for experiment ${id}`);
    let hit = await new Promise((resolve, reject) => {
      mt.createHIT(params, function(err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data.HIT);
        }
      });
    });
    console.log(`HIT created. HITId: ${hit.HITId}`);
    experiment.data.status = ExperimentStatus.PUBLISHED;
    experiment.data.publishedAt = new Date();
    experiment.data.hit = { ...hit };
    setupCronForHit(experiment, hit.HITId, mt);
    return await update(id, experiment.data);
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to publish experiment');
  }
});

/**
 * Retrieves the worker_assignment records associated withe the given experiment.
 *
 * @param {string} experimentId
 */
const getAssignments = (exports.getAssignments = async experimentId => {
  try {
    let res = await db.query(
      `select * from ${db.TABLES.WorkerAssignment} where experiment_id = $1`,
      [experimentId]
    );
    return { rows: res.rows, meta: { count: res.rowCount } };
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation(
      "Error while trying to fetch the experiment's assignments"
    );
  }
});

/**
 * Set a cron job that polls the HIT status in order to know when
 * the approval/rejection logic should run.
 *
 * @param {string} experiment
 * @param {string} hitId
 * @param {Object} mturk
 */
const setupCronForHit = (experiment, hitId, mturk) => {
  const experimentId = experiment.id;
  const job = new CronJob({
    cronTime: `0 */${config.cron.hitStatusPollTime} * * * *`,
    onTick: async () => {
      console.log(`Checking HIT: ${hitId} status`);

      try {
        let hit = await new Promise((resolve, reject) => {
          mturk.getHIT({ HITId: hitId }, function(err, data) {
            if (err) {
              reject(err);
            } else {
              resolve(data.HIT);
            }
          });
        });
        console.log(`HIT: ${hitId} is ${hit.HITStatus}`);

        if (hit.HITStatus === 'Reviewable') {
          const stop = await reviewAssignments(experiment, mturk);

          if (stop) {
            console.log(`Stopping cron job for HIT: ${hitId}`);
            job.stop();
          }
        }
      } catch (error) {
        console.error(error);
      }
    },
    start: false
  });

  job.start();
};

/**
 * Approves or rejects submitted assignment for a HIT.
 *
 * @param {string} experiment
 * @param {Object} mturk
 */
const reviewAssignments = async (experiment, mturk) => {
  const experimentId = experiment.id;
  console.log(`Review assignments for experiment: ${experimentId}`);

  try {
    const assignments = await getAssignments(experimentId);

    for (assignment of assignments.rows) {
      console.log(`Reviewing ${assignment.data.assignmentId}`);

      if (!assignment.data.finished) {
        console.warn(
          `reviewAssignments called even though the assignment ${
            assignment.data.assignmentId
          } did not finish`
        );
        continue;
      }

      if (assignment.data.initialTestFailed) {
        await mturkRejectAssignment(assignment.data.assignmentId, mturk);
      } else {
        await mturkApproveAssignment(assignment.data.assignmentId, mturk);
        await sendBonus(
          experiment.uuid,
          assignment.worker_id,
          assignment.data.assignmentId,
          mturk
        );
      }
    }
    console.log(`Review assignments for experiment: ${experimentId} done`);
    await update(experimentId, {
      status: ExperimentStatus.DONE,
      finishedAt: new Date()
    });
    return true;
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation(
      "Error while trying to fetch worker's answers"
    );
  }
};

/**
 * Wrapper for Mechanical Turk approveAssignment operation.
 * @param {string} id - Assignment ID
 * @param {Object} mturk
 */
const mturkApproveAssignment = async (id, mturk) => {
  console.log(`Approving assignment ${id}...`);
  return await new Promise((resolve, reject) => {
    mturk.approveAssignment({ AssignmentId: id }, function(err, data) {
      if (err) {
        reject(err);
      } else {
        console.log(
          `Approve assignment response for ${id} is: ${JSON.stringify(data)}`
        );
        resolve(data);
      }
    });
  });
};

/**
 * Wrapper for Mechanical Turk rejectAssignment operation.
 * @param {string} id - Assignment ID
 * @param {Object} mturk
 */
const mturkRejectAssignment = async (id, mturk) => {
  console.log(`Rejecting assignment ${id}...`);
  const payload = {
    AssignmentId: id,
    RequesterFeedback:
      'Thank you for participating, but you failed to pass the qualification test.'
  };
  return await new Promise((resolve, reject) => {
    mturk.rejectAssignment(payload, (err, data) => {
      if (err) {
        reject(err);
      } else {
        console.log(
          `Reject assignment response for ${id} is: ${JSON.stringify(data)}`
        );
        resolve(data);
      }
    });
  });
};

/**
 * Wrapper for Mechanical Turk sendBonus operation. Here we pay
 * the worker based on the number of answers given.
 *
 * @param {string} uuid - The experiment's UUID
 * @param {string} workerId -
 * @param {string} assignmentId
 * @param {Object} mturk
 */
const sendBonus = async (uuid, workerId, assignmentId, mturk) => {
  const worker = await workersDelegate.getById(workerId);
  const { reward } = await workersDelegate.getWorkerReward(
    uuid,
    worker.turk_id,
    true
  );
  const payload = {
    AssignmentId: assignmentId,
    BonusAmount: `${reward}`,
    Reason: 'Reward based on the number of answers given',
    WorkerId: workerId
  };
  return await new Promise((resolve, reject) => {
    mturk.sendBonus(payload, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};
