//jest.mock('request');
const csv = require('csv-parser');

const projectsDelegate = require('./projects');
const requestersDelegate = require('./requesters');
const config = require(__base + 'config');
const projectsEvent = require(__base + 'events/projects');
const { EventTypes } = projectsEvent;

test('projects module should be defined', () => {
  expect(projectsDelegate).toBeDefined();
});

test('getByRequester for undefined requester returns 0 rows', async () => {
  const res = await projectsDelegate.getByRequester(1);
  expect(res.meta.count).toBe(0);
});

describe('projects.create', async () => {
  let requester;
  let methodCalled = false;

  beforeAll(async () => {
    requester = await requestersDelegate.create({
      gid: '121212121212',
      name: 'Linus',
      email: 'linus@linux.com'
    });

    projectsDelegate.createRecordsFromCSVs = jest.fn(
      () => (methodCalled = true)
    );
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
    methodCalled = false;

    let project = await projectsDelegate.create({
      requester_id: requester.id,
      data: {
        name: 'test',
        itemsUrl: 'http://url-items',
        filtersUrl: 'http://url-filters',
        testsUrl: 'http://url-tests',
        consentUrl: 'http://url-consent',
        consentFormat: 'MARKDOWN'
      }
    });
    expect(project.data).toMatchObject({
      itemsCreated: false,
      filtersCreated: false,
      testsCreated: false
    });
  });

  test(`create should emit ${EventTypes.PROCESS_CSV}`, async () => {
    methodCalled = false;

    await projectsDelegate.create({
      requester_id: requester.id,
      data: {
        name: 'test',
        itemsUrl: 'http://url-items',
        filtersUrl: 'http://url-filters',
        testsUrl: 'http://url-tests',
        consentUrl: 'http://url-consent',
        consentFormat: 'MARKDOWN'
      }
    });

    expect(methodCalled).toBe(true);
  });
});

describe('projects.copy', async () => {
  let requester;
  let project;

  beforeAll(async () => {
    projectsDelegate.createRecordsFromCSVs = jest.fn();

    requester = await requestersDelegate.create({
      gid: '121212121212',
      name: 'Linus',
      email: 'linus@linux.com'
    });

    project = await projectsDelegate.create({
      requester_id: requester.id,
      data: {
        name: 'test',
        itemsUrl: 'http://url-items',
        filtersUrl: 'http://url-filters',
        testsUrl: 'http://url-tests',
        consentUrl: 'http://url-consent',
        consentFormat: 'MARKDOWN'
      }
    });
  });

  test('copy should throw if ID is not specified', async () => {
    try {
      await projectsDelegate.copy();
    } catch (error) {
      expect(error.message).toBe('ID must be specified');
    }
  });

  test('copy should throw if source does not exists', async () => {
    let id = 1000;

    try {
      await projectsDelegate.copy(id);
    } catch (error) {
      expect(error.message).toBe(`The project with id ${id} does not exist.`);
    }
  });

  test('copy should clone the record and give it a different ID', async () => {
    let copiedProject = await projectsDelegate.copy(project.id);
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
