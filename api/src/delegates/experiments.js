const Boom = require('boom');
const couchbase = require('couchbase');
const uuid = require('uuid/v4');
const request = require('request');
const parse = require('csv-parse');
const transform = require('stream-transform');
const CronJob = require('cron').CronJob;

const bucket = require(__base + 'db').bucket;
const config = require(__base + 'config');
const { DOCUMENTS, TYPES } = require(__base + 'db');
const tasksDelegate = require('./tasks');
const requestersDelegate = require('./requesters');
const MTurk = require(__base + 'utils/mturk');
const workersDelegate = require('./workers');

const ExperimentStatus = Object.freeze({
  NOT_PUBLISHED: 'NOT_PUBLISHED',
  PUBLISHED: 'PUBLISHED',
  DONE: 'DONE'
});

const getByRequester = (exports.getByRequester = async requesterId => {
  try {
    const qs = `select * from \`${config.db.bucket}\` where type="${
      TYPES.experiment
    }" and requesterId='${requesterId}'`;
    const q = couchbase.N1qlQuery.fromString(qs);
    return await new Promise((resolve, reject) => {
      bucket.query(q, (err, answers) => {
        if (err) {
          reject(err);
        } else {
          resolve(answers.map(a => a[config.db.bucket]));
        }
      });
    });
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch records');
  }
});

const getByRequesterCount = (exports.getByRequesterCount = async workerId => {
  try {
    const qs = `select count(*) as count from \`${
      config.db.bucket
    }\` where type="${TYPES.experiment}" and requesterId='${requesterId}'`;
    const q = couchbase.N1qlQuery.fromString(qs);
    q.consistency(couchbase.N1qlQuery.Consistency.STATEMENT_PLUS);
    return await new Promise((resolve, reject) => {
      bucket.query(q, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data[0].count);
        }
      });
    });
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch records count');
  }
});

const getById = (exports.getById = async id => {
  try {
    let experiment = await new Promise((resolve, reject) => {
      bucket.get(`${DOCUMENTS.Experiment}${id}`, (err, data) => {
        if (err) {
          if (err.code === couchbase.errors.keyNotFound) {
            resolve(null);
          } else {
            reject(err);
          }
        } else {
          resolve(data.value);
        }
      });
    });
    experiment.consent = await new Promise((resolve, reject) => {
      request(experiment.consentUrl, (err, rsp, body) => {
        if (err) {
          reject(err);
        } else {
          resolve(rsp.body);
        }
      });
    });
    return experiment;
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch the record');
  }
});

const create = (exports.create = async item => {
  try {
    item.id = uuid();
    const key = `${DOCUMENTS.Experiment}${item.id}`;
    item = {
      ...item,
      maxTasksRule: Number(item.maxTasksRule),
      taskRewardRule: Number(item.taskRewardRule),
      testFrequencyRule: Number(item.testFrequencyRule),
      initialTestsRule: Number(item.initialTestsRule),
      initialTestsMinCorrectAnswersRule: Number(
        item.initialTestsMinCorrectAnswersRule
      ),
      votesPerTaskRule: Number(item.votesPerTaskRule),
      createdAt: new Date(),
      type: TYPES.experiment
    };

    let cas = await new Promise((resolve, reject) => {
      bucket.insert(key, item, (error, result) => {
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
    await createTasks(item);
    return cas;
  } catch (error) {
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
      TYPES.WorkerAssignment
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

const createTasks = async experiment => {
  let parser = parse({ delimiter: ',', columns: true });
  // first we read the filters
  let filters = [];
  const filtersTransformer = transform(record => filters.push(record), {
    parallel: 10
  });

  try {
    request(experiment.filtersUrl)
      .pipe(parser)
      .pipe(filtersTransformer);

    await new Promise((resolve, reject) => {
      filtersTransformer.on('finish', () => {
        resolve();
      });

      filtersTransformer.on('error', err => {
        reject(err);
      });
    });
    // insert tasks into the database.
    const itemsTransformer = transform(
      async item => {
        for (filter of filters) {
          await tasksDelegate.createTask({
            id: uuid(),
            filter,
            item,
            experimentId: experiment.id
          });
        }
      },
      { parallel: 10 }
    );
    let itemsParser = parse({ delimiter: ',', columns: true });
    request(experiment.itemsUrl)
      .pipe(itemsParser)
      .pipe(itemsTransformer);

    await new Promise((resolve, reject) => {
      itemsTransformer.on('finish', () => {
        resolve();
      });

      itemsTransformer.on('error', err => {
        reject(err);
      });
    });

    // insert test task into the database
    const testsTransformer = transform(
      async testTask => {
        await tasksDelegate.createTask(
          {
            ...testTask,
            id: uuid(),
            experimentId: experiment.id
          },
          true
        );
      },
      { parallel: 10 }
    );
    let testsParser = parse({ delimiter: ',', columns: true });
    request(experiment.testsUrl)
      .pipe(testsParser)
      .pipe(testsTransformer);

    await new Promise((resolve, reject) => {
      testsTransformer.on('finish', () => {
        resolve();
      });

      testsTransformer.on('error', err => {
        reject(err);
      });
    });
  } catch (error) {
    console.error(error);
  }
};

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
    cronTime: '0 */10 * * * *',
    onTick: async () => {
      // tick every 10 minutes
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
  console.log(`Review assigments for experiment: ${experimentId}`);

  try {
    const assignments = await getAssignments(experimentId);

    for (assignment of assignments) {
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
        await sendBonus(experimentId, workerId, assignment.assignmentId, mturk);
      }
    }
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
  return await new Promise((resolve, reject) => {
    mturk.approveAssignment({ AssignmentId: id }, function(err, data) {
      if (err) {
        reject(err);
      } else {
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
  const amount = await workersDelegate.getWorkerReward(
    experimentId,
    workerId,
    true
  );
  const payload = {
    AssignmentId: assignmentId,
    BonusAmount: `${amount}`,
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
