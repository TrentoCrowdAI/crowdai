const Boom = require('boom');
const uuid = require('uuid/v4');
const request = require('request');

const { JobStatus } = require(__base + 'utils/constants');
const db = require(__base + 'db');

const getByProject = (exports.getByProject = async projectId => {
  try {
    let res = await db.query(
      `select * from ${db.TABLES.Job} where project_id = $1`,
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
    let res = await db.query(`select * from ${db.TABLES.Job} where id = $1`, [
      id
    ]);
    return res.rows[0];
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch the record');
  }
});

const getByUuid = (exports.getByUuid = async uuid => {
  try {
    let res = await db.query(`select * from ${db.TABLES.Job} where uuid = $1`, [
      uuid
    ]);
    return res.rows[0];
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch the record');
  }
});

/**
 * Download the instructions of the job specified in job.data.instructions property.
 *
 * @param {Object} job
 * @return {Object} -- {C1_ID: {content: '', format: '', taskInstructionsUrl: ''}, C2_ID: {content: '', format: '', taskInstructionsUrl: ''}}
 */
const getInstructions = (exports.getInstructions = async job => {
  let instructions = {};
  try {
    for ([criteriaId, e] of Object.entries(job.data.instructions)) {
      instructions[criteriaId] = {
        ...e
      };
      instructions[criteriaId].content = await new Promise(
        (resolve, reject) => {
          request(e.taskInstructionsUrl, (err, rsp, body) => {
            if (err) {
              reject(err);
            } else {
              resolve(rsp.body);
            }
          });
        }
      );
    }
    return instructions;
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation(
      'Error while trying to fetch the instructions'
    );
  }
});

/**
 * Get the requester associated with the job.
 *
 * @param {Number} id - The job ID
 * @return {Object}
 */
const getRequester = (exports.getRequester = async id => {
  try {
    let res = await db.query(
      `select r.* from ${db.TABLES.Job} e join ${
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

const create = (exports.create = async job => {
  try {
    await db.query('BEGIN');
    let res = await db.query(
      `insert into ${
        db.TABLES.Job
      }(project_id, uuid, created_at, data) values($1, $2, $3, $4) returning *`,
      [job.project_id, uuid(), new Date(), job.data]
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
 * Updates the given job. We only update the data column.
 *
 * @param {Number} id - The job's ID.
 * @param {Object} jobData - Attributes to update in data column
 */
const update = (exports.update = async (id, jobData) => {
  try {
    let saved = await getById(id);

    if (saved.data.status !== JobStatus.NOT_PUBLISHED) {
      throw Boom.badRequest('You can only update an unpublished job.');
    }

    let data = {
      ...saved.data,
      ...jobData
    };
    let res = await db.query(
      `update ${
        db.TABLES.Job
      } set updated_at = $1, data = $2 where id = $3 returning *`,
      [new Date(), data, id]
    );
    return res.rows[0];
  } catch (error) {
    console.error(error);

    if (error.isBoom) {
      throw error;
    }
    throw Boom.badImplementation('Error while trying to update the record');
  }
});

/**
 * Retrieves the worker_assignment records associated withe the given job.
 *
 * @param {string} jobId
 */
const getAssignments = (exports.getAssignments = async jobId => {
  try {
    let res = await db.query(
      `select * from ${db.TABLES.WorkerAssignment} where job_id = $1`,
      [jobId]
    );
    return { rows: res.rows, meta: { count: res.rowCount } };
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation(
      "Error while trying to fetch the job's assignments"
    );
  }
});
