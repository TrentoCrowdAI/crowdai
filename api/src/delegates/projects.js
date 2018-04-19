const Boom = require('boom');
const uuid = require('uuid/v4');
const request = require('request');
const csv = require('csv-parser');
const QueryStream = require('pg-query-stream');

const db = require(__base + 'db');
const tasksDelegate = require('./tasks');
const requestersDelegate = require('./requesters');

const getByRequester = (exports.getByRequester = async id => {
  try {
    let res = await db.query(
      `select * from ${db.TABLES.Project} where requester_id = $1`,
      [id]
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
      `select * from ${db.TABLES.Project} where id = $1`,
      [id]
    );
    const project = res.rows[0];
    project.consent = await new Promise((resolve, reject) => {
      request(project.data.consentUrl, (err, rsp, body) => {
        if (err) {
          reject(err);
        } else {
          resolve(rsp.body);
        }
      });
    });
    res = await getCriteria(id);

    if (res) {
      project.criteria = res.rows;
    }
    return project;
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch the record');
  }
});

/**
 * Creates a new project record.
 *
 * @param {Object} - The project to create
 * @param {Boolean} - Whether we want to skip the CSV creation.
 */
const create = (exports.create = async (project, createCSV = true) => {
  if (!project) {
    throw Boom.badRequest('Project attributes are required');
  }
  let data = {
    ...project.data,
    itemsCreated: false,
    filtersCreated: false,
    testsCreated: false
  };

  try {
    await db.query('BEGIN');
    let res = await db.query(
      `insert into ${
        db.TABLES.Project
      }(requester_id, created_at, data) values($1, $2, $3) returning *`,
      [project.requester_id, new Date(), data]
    );
    const created = res.rows[0];
    await db.query('COMMIT');

    if (createCSV) {
      createRecordsFromCSVs(created);
    }
    return created;
  } catch (error) {
    console.error(error);
    await db.query('ROLLBACK');
    throw Boom.badImplementation('Error while trying to persist the record');
  }
});

/**
 * Updates the given project record.
 *
 * @param {Number} id - The project ID.
 * @param {Object} projectData - The project data property with values updated.
 * @param {Boolean} createCSV - Whether we want to skip the CSV creation.
 */
const update = (exports.update = async (id, projectData) => {
  if (!projectData) {
    throw Boom.badRequest('Project attributes are required');
  }

  if (!id) {
    throw Boom.badRequest('Project must have an ID');
  }

  try {
    let saved = await getById(id);
    let genCSV = false;
    let data = {
      ...saved.data,
      ...projectData
    };

    if (
      saved.data.itemsUrl !== projectData.itemsUrl ||
      saved.data.filtersUrl !== projectData.filtersUrl ||
      saved.data.testsUrl !== projectData.testsUrl
    ) {
      let count = await getJobsCount(id);

      if (count > 0) {
        throw Boom.badRequest(
          'You can not update any of the CSV files. The project already has at least one job.'
        );
      }

      genCSV = true;
      data = {
        ...data,
        itemsCreated: false,
        filtersCreated: false,
        testsCreated: false
      };
    }

    let res = await db.query(
      `update ${
        db.TABLES.Project
      } set updated_at = $1, data = $2 where id = $3 returning *`,
      [new Date(), data, id]
    );
    let updated = res.rows[0];

    if (genCSV) {
      createRecordsFromCSVs(updated, true);
    }
    return updated;
  } catch (error) {
    console.error(error);

    if (error.isBoom) {
      throw error;
    }
    throw Boom.badImplementation('Error while trying to update the record');
  }
});

/**
 * Returns the number of jobs associated with the given project.
 *
 * @param {Number} id - The project ID.
 * @return {Number}
 */
const getJobsCount = (exports.getJobsCount = async id => {
  try {
    let res = await db.query(
      `select count(*) as count from  ${db.TABLES.Job} where project_id = $1`,
      [id]
    );
    return res.rows[0].count;
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch the count');
  }
});

/**
 * Returns the items that are associated with the given project.
 *
 * @param {Number} projectId
 * @return {QueryStream} stream-like cursor to iterate over the rows.
 */
const getItemsQS = (exports.getItems = async projectId => {
  try {
    const query = new QueryStream(
      `select * from  ${db.TABLES.Item} where project_id = $1`,
      [projectId]
    );
    const stream = await db.query(query);
    return stream;
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch project items');
  }
});

/**
 * Returns the number of items that are associated with the given project.
 *
 * @param {Number} projectId
 * @return {Number}
 */
const getItemsCount = (exports.getItemsCount = async projectId => {
  try {
    let res = await db.query(
      `select count(*) as count from  ${db.TABLES.Item} where project_id = $1`,
      [projectId]
    );
    return Number(res.rows[0].count);
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch project items');
  }
});

/**
 * Returns the criterion list associated with the project
 *
 * @param {Number} id - The project's ID
 * @return {Object}
 */
const getCriteria = (exports.getCriteria = async id => {
  try {
    let res = await db.query(
      `select * from ${db.TABLES.Criterion} where project_id = $1`,
      [id]
    );
    return res.rowCount > 0
      ? { rows: res.rows, meta: { count: res.rowCount } }
      : null;
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch records');
  }
});

/**
 * Returns the number of criteria associated with the project
 *
 * @param {Number} id - The project's ID
 * @return {Number}
 */
const getCriteriaCount = (exports.getCriteriaCount = async id => {
  try {
    let res = await db.query(
      `select count(*) from ${db.TABLES.Criterion} where project_id = $1`,
      [id]
    );
    return Number(res.rows[0].count);
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch records');
  }
});

/**
 * Returns the criteria for the given criterion ID list.
 *
 * @param {Number[]} criteria - Array of criterion IDs
 * @return {Object[]}
 */
const getCriteriaFromIds = (exports.getCriteriaFromIds = async criteria => {
  try {
    let res = await db.query(
      `select * from ${db.TABLES.Criterion} where id = ANY ($1)`,
      [criteria]
    );
    return res.rowCount > 0 ? res.rows : null;
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch records');
  }
});

/**
 * Returns the tests associated with the project
 *
 * @param {Number} id - The project's ID
 * @return {Object}
 */
const getTests = (exports.getTests = async id => {
  try {
    let res = await db.query(
      `select * from ${db.TABLES.Test} where project_id = $1`,
      [id]
    );
    return res.rowCount > 0
      ? { rows: res.rows, meta: { count: res.rowCount } }
      : null;
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch records');
  }
});

/**
 * Returns the number of tests associated with the project
 *
 * @param {Number} id - The project's ID
 * @return {Number}
 */
const getTestsCount = (exports.getTestsCount = async id => {
  try {
    let res = await db.query(
      `select count(*) from ${db.TABLES.Test} where project_id = $1`,
      [id]
    );
    return Number(res.rows[0].count);
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch records');
  }
});

/**
 * Creates the items, filters and tests records for the given project.
 *
 * @param {Object} project
 * @param {Boolean} truncate - if true, remove all items, filters and tests associated with the project.
 */
const createRecordsFromCSVs = (exports.createRecordsFromCSVs = async (
  project,
  truncate = false
) => {
  try {
    if (truncate) {
      await truncateProject(project.id);
    }
    await createItems(project);
    await createCriteria(project);
    await createTests(project);
    return true;
  } catch (error) {
    console.error(error);
  }
});

/**
 * Removes all the items, filters and tests records for the given project.
 *
 * @param {Number} id
 */
const truncateProject = async id => {
  try {
    console.debug(`Truncate project: ${id}`);
    await db.query('BEGIN');
    await db.query(`delete from ${db.TABLES.Item} where project_id = $1`, [id]);
    await db.query(`delete from ${db.TABLES.Criterion} where project_id = $1`, [
      id
    ]);
    await db.query(`delete from ${db.TABLES.Test} where project_id = $1`, [id]);
    await db.query('COMMIT');
  } catch (error) {
    await db.query('ROLLBACK');
    console.error(error);
    throw error;
  }
};

const createItems = async project => {
  try {
    console.log(`Creating items for project: ${project.id}`);
    let items = [];
    const transformer = item =>
      items.push({
        title: item.itemTitle,
        description: item.itemDescription
      });

    await new Promise((resolve, reject) => {
      request(project.data.itemsUrl)
        .on('error', err => reject(err))
        .pipe(csv())
        .on('data', transformer)
        .on('end', () => resolve())
        .on('error', err => reject(err));
    });
    await db.query('BEGIN');

    for (item of items) {
      await db.query(
        `insert into ${
          db.TABLES.Item
        }(created_at, project_id, data) values($1, $2, $3)`,
        [new Date(), project.id, item]
      );
    }

    await db.query(
      `update ${db.TABLES.Project} 
       set data = jsonb_set(data, '{itemsCreated}', 'true'::jsonb)
       where id = ${project.id}`
    );
    await db.query('COMMIT');
  } catch (error) {
    console.error(error);
    await db.query('ROLLBACK');
  }
};

const createCriteria = async project => {
  console.log(`Creating filters for project: ${project.id}`);
  try {
    let criteria = [];
    let labelCount = 1;

    const transformer = criterion =>
      criteria.push({
        label: `C${labelCount++}`,
        description: criterion.filterDescription
      });

    await new Promise((resolve, reject) => {
      request(project.data.filtersUrl)
        .on('error', err => reject(err))
        .pipe(csv())
        .on('data', transformer)
        .on('end', () => resolve())
        .on('error', err => reject(err));
    });
    await db.query('BEGIN');

    for (criterion of criteria) {
      await db.query(
        `insert into ${
          db.TABLES.Criterion
        }(created_at, project_id, data) values($1, $2, $3)`,
        [new Date(), project.id, criterion]
      );
    }
    await db.query(
      `update ${db.TABLES.Project} 
       set data = jsonb_set(data, '{filtersCreated}', 'true'::jsonb)
       where id = ${project.id}`
    );
    await db.query('COMMIT');
  } catch (error) {
    console.error(error);
    await db.query('ROLLBACK');
  }
};

const createTests = async project => {
  console.log(`Creating tests for project: ${project.id}`);
  try {
    let tests = [];
    const transformer = test => tests.push(test);

    await new Promise((resolve, reject) => {
      request(project.data.testsUrl)
        .on('error', err => reject(err))
        .pipe(csv())
        .on('data', transformer)
        .on('end', () => resolve())
        .on('error', err => reject(err));
    });

    let criteria = await getCriteria(project.id);
    let descriptionMap = {};

    for (c of criteria.rows) {
      descriptionMap[c.data.description.trim()] = c;
    }
    await db.query('BEGIN');

    for (test of tests) {
      let criterion = descriptionMap[test.filterDescription.trim()];
      let data = {
        item: { title: test.itemTitle, description: test.itemDescription },
        criteria: [
          {
            id: criterion.id,
            label: criterion.data.label,
            description: test.filterDescription.trim(),
            answer: test.answer
          }
        ]
      };
      await db.query(
        `insert into ${
          db.TABLES.Test
        }(created_at, project_id, data) values($1, $2, $3)`,
        [new Date(), project.id, data]
      );
    }
    await db.query(
      `update ${db.TABLES.Project} 
       set data = jsonb_set(data, '{testsCreated}', 'true'::jsonb)
       where id = ${project.id}`
    );
    await db.query('COMMIT');
  } catch (error) {
    console.error(error);
    await db.query('ROLLBACK');
  }
};
