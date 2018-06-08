const Boom = require('boom');
const uuid = require('uuid/v4');
const request = require('request');

const { JobStatus } = require(__base + 'utils/constants');
const db = require(__base + 'db');
const projectsDelegate = require('./projects');
const { EventTypes } = require(__base + 'events');
const { emit } = require(__base + 'events/emitter');

const getByRequester = (exports.getByRequester = async requesterId => {
  try {
    let res = await db.query(
      `select * from ${db.TABLES.Job} where requester_id = $1`,
      [requesterId]
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
 * @return {Object} The following object is returned:
 * @example
 * {
 *   C1_LABEL: {content: '', format: '', taskInstructionsUrl: ''},
 *   C2_LABEL: {content: '', format: '', taskInstructionsUrl: ''}
 * }
 */
const getInstructions = (exports.getInstructions = async job => {
  let instructions = {};
  try {
    for ([label, e] of Object.entries(job.data.instructions)) {
      instructions[label] = { ...e };
      instructions[label].content = await new Promise((resolve, reject) => {
        request(e.taskInstructionsUrl, (err, rsp, body) => {
          if (err) {
            reject(err);
          } else {
            resolve(rsp.body);
          }
        });
      });
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
 * This methods creates a new job:
 *
 * 1) It creates a project record, where we store items, tests and filters.
 * 2) Creates a new job record associated with the project created in (1).
 * 3) emits the JOB_CREATED event passing the created job as a parameter.
 *
 * @param {Object} job
 * @return {Object} the record created.
 */
const create = (exports.create = async job => {
  try {
    await db.query('BEGIN');
    let projectId = job.project_id;

    if (!job.project_id) {
      let project = await projectsDelegate.create(
        job.data.itemsUrl,
        job.data.testsUrl,
        job.criteria
      );
      projectId = project.id;
    }
    job.data.status = JobStatus.NOT_PUBLISHED;

    let res = await db.query(
      `insert into ${
        db.TABLES.Job
      }(project_id, requester_id, uuid, created_at, data) values($1, $2, $3, $4, $5) returning *`,
      [projectId, job.requester_id, uuid(), new Date(), job.data]
    );
    const saved = res.rows[0];
    await db.query('COMMIT');
    emit(EventTypes.job.JOB_CREATED, saved);
    return saved;
  } catch (error) {
    await db.query('ROLLBACK');
    console.error(error);
    throw Boom.badImplementation('Error while trying to persist the record');
  }
});

/**
 * Updates the given job. If the attributes itemsUrl, filtersUrl, testsUrl
 * and/or criteria changes, then a new project record will be created together with
 * its CSV files.
 *
 * @param {Number} id - The job's ID.
 * @param {Object} job - The job object with updated attributes
 */
const update = (exports.update = async (id, job) => {
  try {
    let saved = await getById(id);

    if (
      saved.data.status !== JobStatus.NOT_PUBLISHED &&
      job.data.status !== JobStatus.DONE
    ) {
      throw Boom.badRequest('You can only update an unpublished job.');
    }

    if (
      job.data.itemsUrl !== saved.data.itemsUrl ||
      job.data.testsUrl !== saved.data.testsUrl ||
      job.data.filtersUrl !== saved.data.filtersUrl
    ) {
      let project = await projectsDelegate.create(
        job.data.itemsUrl,
        job.data.testsUrl,
        job.criteria
      );
      job.project_id = project.id;
      await projectsDelegate.safeDelete(saved.project_id);
    }

    let data = {
      ...saved.data,
      ...job.data
    };
    let res = await db.query(
      `update ${
        db.TABLES.Job
      } set project_id = $1, updated_at = $2, data = $3 where id = $4 returning *`,
      [job.project_id, new Date(), data, id]
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

/**
 * Retrieves the worker_assignment records associated with the given job. This record
 * corresponds to those where a worker clicked on the finish button.
 *
 * @param {string} jobId
 */
const getAssignmentsFinishedByWorkers = (exports.getAssignmentsFinishedByWorkers = async jobId => {
  try {
    let res = await db.query(
      `select * from ${db.TABLES.WorkerAssignment} 
        where job_id = $1
          and (data ->> 'finished')::boolean = true 
          and (data ->> 'initialTestFailed')::boolean = false
          and (data ->> 'finishedByWorker')::boolean = true
      `,
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

/**
 * Creates a copy of the given job.
 *
 * @param {Number} id - The job's ID we want to copy from.
 */
const copy = (exports.copy = async id => {
  let sourceJob;

  try {
    sourceJob = await getById(id);
  } catch (error) {
    console.error(error);
  }

  if (!sourceJob) {
    throw Boom.badRequest(`The job with id ${id} does not exist.`);
  }

  try {
    let copy = {
      ...sourceJob
    };
    delete copy.id;
    delete copy.uuid;
    delete copy.data.hit;
    let createdCopy = await create(copy);
    return createdCopy;
  } catch (error) {
    console.error(error);

    if (error.isBoom) {
      throw error;
    }
    throw Boom.badImplementation('Error while trying to copy the job');
  }
});

/**
 * Check if the items, filters and tests records are already created.
 *
 * @param {Number} id - The job ID.
 * @return {Object} The status
 *
 * @example
 *
 * {
 *   itemsCreated: <boolean>,
 *   filtersCreated: <boolean>,
 *   testsCreated: <boolean>
 * }
 */
const checkCSVCreation = (exports.checkCSVCreation = async id => {
  try {
    let job = await getById(id);
    let project = await projectsDelegate.getById(job.project_id);
    const { itemsCreated, filtersCreated, testsCreated } = project.data;
    return {
      itemsCreated,
      filtersCreated,
      testsCreated
    };
  } catch (error) {
    console.error(error);

    if (error.isBoom) {
      throw error;
    }
    throw Boom.badImplementation(
      'Error while trying check the progress of the CSV creation proccess'
    );
  }
});

/**
 * Fetch the consent file and returns it.
 *
 * @param {String} url
 * @return {String}
 */
const getConsent = (exports.getConsent = async url => {
  try {
    return await new Promise((resolve, reject) => {
      request(url, (err, rsp, body) => {
        if (err) {
          reject(err);
        } else {
          resolve(rsp.body);
        }
      });
    });
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation(
      'Error while trying fetch informed consent file'
    );
  }
});
