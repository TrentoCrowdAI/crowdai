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

const update = (exports.update = async (id, item) => {
  try {
    let saved = await getById(id);
    let payload = {
      ...saved,
      ...item
    };
    const key = `${DOCUMENTS.Experiment}${item.id}`;
    return await new Promise((resolve, reject) => {
      bucket.upsert(key, payload, (error, result) => {
        if (error) {
          console.error(
            `Error while inserting document ${key}. Error: ${error}`
          );
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to update the record');
  }
});

const publish = (exports.publish = async (id, experiment) => {
  try {
    let requester = await requestersDelegate.getRequesterByMTurkId(
      experiment.requesterId
    );
    const experimentUrl = `${config.frontend.url}/#/welcome/${id}`;
    const mt = MTurk.getInstance(requester);
    let params = {
      AssignmentDurationInSeconds: experiment.assignmentDurationInSeconds,
      Description: experiment.description,
      LifetimeInSeconds: experiment.lifetimeInSeconds,
      Reward: `${experiment.taskRewardRule}`,
      Title: experiment.name,
      MaxAssignments: experiment.maxAssignments,
      Question: `${MTurk.getExternalQuestionPayload(experimentUrl)}`,
      RequesterAnnotation: experiment.name
    };

    let hit = await new Promise((resolve, reject) => {
      mt.createHIT(params, function(err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data.HIT);
        }
      });
    });
    experiment.status = ExperimentStatus.PUBLISHED;
    experiment.publishedAt = new Date();
    experiment.hit = { ...hit };
    setupCronForHit(id, hit.HITId, mt);
    await update(id, experiment);
    return experiment;
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to publish experiment');
  }
});

/**
 * Retrieves the assignments for the given experiment.
 *
 * @param {string} experimentId
 */
const getAssignments = (exports.getAssignments = async experimentId => {
  try {
    const qs = `select * from \`${config.db.bucket}\` where type="${
      TYPES.assignment
    }" and experimentId="${experimentId}"`;
    const q = couchbase.N1qlQuery.fromString(qs);
    return await new Promise((resolve, reject) => {
      bucket.query(q, (err, assignments) => {
        if (err) {
          reject(err);
        } else {
          resolve(assignments.map(a => a[config.db.bucket]));
        }
      });
    });
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
 * @param {string} experimentId
 * @param {string} hitId
 * @param {Object} mturk
 */
const setupCronForHit = (experimentId, hitId, mturk) => {
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
          const stop = await reviewAssignments(experimentId, mturk);

          if (stop) {
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
 * @param {string} experimentId
 * @param {Object} mturk
 */
const reviewAssignments = async (experimentId, mturk) => {
  console.log(`Review assignments for experiment: ${experimentId}`);

  try {
    const assignments = await getAssignments(experimentId);

    for (assignment of assignments) {
      console.log(`Reviewing ${assignment.assignmentId}`);

      if (!assignment.finished) {
        console.warn(
          `reviewAssignments called even though the assignment ${
            assignment.assignmentId
          } did not finish`
        );
        continue;
      }

      if (assignment.initialTestFailed) {
        await mturkRejectAssignment(assignment.assignmentId, mturk);
      } else {
        await mturkApproveAssignment(assignment.assignmentId, mturk);
        await sendBonus(
          experimentId,
          assignment.workerId,
          assignment.assignmentId,
          mturk
        );
      }
    }
    console.log(`Review assignments for experiment: ${experimentId} done`);
    const experiment = await getById(experimentId);
    await update(experimentId, {
      ...experiment,
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
 * @param {string} experimentId
 * @param {string} workerId
 * @param {string} assignmentId
 * @param {Object} mturk
 */
const sendBonus = async (experimentId, workerId, assignmentId, mturk) => {
  const { reward } = await workersDelegate.getWorkerReward(
    experimentId,
    workerId,
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
