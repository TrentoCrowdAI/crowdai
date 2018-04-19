const request = require('request');
const csv = require('csv-parser');

const projectsDelegate = require('./projects');
const requestersDelegate = require('./requesters');
const config = require(__base + 'config');

test('projects module should be defined', () => {
  expect(projectsDelegate).toBeDefined();
});

test('getByRequester for undefined requester returns 0 rows', async () => {
  const res = await projectsDelegate.getByRequester(1);
  expect(res.meta.count).toBe(0);
});

describe('projects.create', async () => {
  let requester;

  beforeAll(async () => {
    requester = await requestersDelegate.create({
      gid: '121212121212',
      name: 'Linus',
      email: 'linus@linux.com'
    });
  });

  test('create should throw an error if requester is not set', async () => {
    let ok = true;

    try {
      await projectsDelegate.create(project);
    } catch (error) {
      ok = false;
    }
    expect(ok).toBe(false);
  });

  test('created project should set itemsCreated, filtersCreated and testsCreated to false', async () => {
    let project = await projectsDelegate.create(
      {
        requester_id: requester.id,
        data: {
          itemsUrl:
            'https://drive.google.com/uc?id=1WT14VQtGfXzPRbSbMx2ImnKbIC9kivup',
          filtersUrl:
            'https://drive.google.com/uc?id=1qemeQ7Gv0iV5NpHI20TaxXwFQTZuNSU2',
          testsUrl:
            'https://drive.google.com/uc?id=1jcssgjpCf1stRXO9LepMNGJyB7a5HAVR'
        }
      },
      false
    );
    expect(project.data).toMatchObject({
      itemsCreated: false,
      filtersCreated: false,
      testsCreated: false
    });
  });

  test('3 items, 1 filter and 3 tests records should be created', async () => {
    let project = await projectsDelegate.create(
      {
        requester_id: requester.id,
        data: {
          itemsUrl:
            'https://drive.google.com/uc?id=1WT14VQtGfXzPRbSbMx2ImnKbIC9kivup',
          filtersUrl:
            'https://drive.google.com/uc?id=1qemeQ7Gv0iV5NpHI20TaxXwFQTZuNSU2',
          testsUrl:
            'https://drive.google.com/uc?id=1jcssgjpCf1stRXO9LepMNGJyB7a5HAVR'
        }
      },
      false
    );
    let res = await projectsDelegate.createRecordsFromCSVs(project);
    expect(res).toBe(true);
    let ic = await projectsDelegate.getItemsCount(project.id);
    expect(ic).toBe(3);
    let cc = await projectsDelegate.getCriteriaCount(project.id);
    expect(cc).toBe(1);
    let tc = await projectsDelegate.getTestsCount(project.id);
    expect(tc).toBe(3);
  });

  test('download 200-tests csv', async () => {
    jest.setTimeout(10000);
    let tests = [];

    await new Promise((resolve, reject) => {
      request(
        'https://drive.google.com/uc?id=1m1lwuiU6u9UBdjPvwa5powbyTAXRKcBR'
      )
        .on('error', err => reject(err))
        .pipe(csv())
        .on('data', test => tests.push(test))
        .on('end', () => resolve())
        .on('error', err => reject(err));
    });
    expect(tests.length).toBe(200);
    jest.setTimeout(5000);
  });
});

describe('projects.copy', async () => {
  let requester;
  let project;

  beforeAll(async () => {
    requester = await requestersDelegate.create({
      gid: '121212121212',
      name: 'Linus',
      email: 'linus@linux.com'
    });

    project = await projectsDelegate.create(
      {
        requester_id: requester.id,
        data: {
          name: 'test project',
          itemsUrl:
            'https://drive.google.com/uc?id=1WT14VQtGfXzPRbSbMx2ImnKbIC9kivup',
          filtersUrl:
            'https://drive.google.com/uc?id=1qemeQ7Gv0iV5NpHI20TaxXwFQTZuNSU2',
          testsUrl:
            'https://drive.google.com/uc?id=1jcssgjpCf1stRXO9LepMNGJyB7a5HAVR',
          consentUrl:
            'https://drive.google.com/uc?id=1NvaymonTzcPgt3jmTIG5BRu-Pp9XF3T9',
          consentFormat: 'MARKDOWN'
        }
      },
      false
    );
  });

  test('copy should throw if ID is not specified', async () => {
    let ok = true;

    try {
      await projectsDelegate.copy();
    } catch (error) {
      if (error.message === 'ID must be specified') {
        ok = false;
      }
    }
    expect(ok).toBe(false);
  });

  test('copy should throw if source does not exists', async () => {
    let ok = true;
    let id = 1000;

    try {
      await projectsDelegate.copy(id);
    } catch (error) {
      console.log(error.message);
      if (error.message === `The project with id ${id} does not exist.`) {
        ok = false;
      }
    }
    expect(ok).toBe(false);
  });

  test('copy should clone the record and give it a different ID', async () => {
    let copiedProject = await projectsDelegate.copy(project.id, false);
    expect(copiedProject).toMatchObject({
      requester_id: project.requester_id,
      data: {
        name: project.data.name,
        itemsUrl: project.data.itemsUrl,
        testsUrl: project.data.testsUrl,
        consentUrl: project.data.consentUrl,
        filtersUrl: project.data.filtersUrl,
        consentFormat: project.data.consentFormat,
        itemsCreated: false,
        testsCreated: false,
        filtersCreated: false
      }
    });

    expect(copiedProject.id).not.toBe(project.id);
  });
});
