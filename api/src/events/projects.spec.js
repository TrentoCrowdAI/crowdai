const projectsEvent = require('./projects');
const { emit } = require('./emitter');
const projectsDelegate = require(__base + 'delegates/projects');
const { EventTypes } = require('./types');

test('projects event module should be defined', () => {
  expect(projectsEvent).toBeDefined();
});

test(`emitting ${
  EventTypes.project.PROCESS_CSV
} should call projectsDelegate.createRecordsFromCSVs`, () => {
  let methodCalled = false;
  projectsDelegate.createRecordsFromCSVs = jest.fn(() => (methodCalled = true));
  emit(EventTypes.project.PROCESS_CSV);
  expect(methodCalled).toBe(true);
});
