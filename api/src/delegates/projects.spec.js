const csv = require('csv-parser');

const projectsDelegate = require('./projects');
const projectsEvent = require(__base + 'events/projects');
const { EventTypes } = projectsEvent;

test('projects module should be defined', () => {
  expect(projectsDelegate).toBeDefined();
});

describe('projects.create', async () => {
  let methodCalled = false;

  beforeAll(async () => {
    projectsDelegate.createRecordsFromCSVs = jest.fn(
      () => (methodCalled = true)
    );
  });

  test('create should throw an error if the parameters are not specified', async () => {
    let ok = true;

    try {
      await projectsDelegate.create();
    } catch (error) {
      ok = false;
    }
    expect(ok).toBe(false);
  });

  test('created project should set itemsCreated and testsCreated to false', async () => {
    methodCalled = false;

    let project = await projectsDelegate.create(
      'http://url-items',
      'http://url-tests',
      [{ label: 'C1', description: 'a filter' }]
    );
    expect(project.data).toMatchObject({
      itemsCreated: false,
      testsCreated: false
    });
  });

  test(`create should emit ${EventTypes.PROCESS_CSV}`, async () => {
    methodCalled = false;
    await projectsDelegate.create('http://url-items', 'http://url-tests', [
      { label: 'C1', description: 'a filter' }
    ]);
    expect(methodCalled).toBe(true);
  });
});
