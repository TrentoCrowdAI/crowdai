const projectsEvent = require('./projects');
const { emit } = require('./emitter');
const projectsDelegate = require(__base + 'delegates/projects');

test('projects event module should be defined', () => {
  expect(projectsEvent).toBeDefined();
});

test('projects event module should exports EventTypes', () => {
  expect(projectsEvent.EventTypes).toBeDefined();
});

test(`emitting ${
  projectsEvent.EventTypes.PROCESS_CSV
} should call projectsDelegate.createRecordsFromCSVs`, () => {
  let methodCalled = false;
  projectsDelegate.createRecordsFromCSVs = jest.fn(() => (methodCalled = true));
  emit(projectsEvent.EventTypes.PROCESS_CSV);

  expect(methodCalled).toBe(true);
});
