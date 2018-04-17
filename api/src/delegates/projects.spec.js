test('projects module should be defined', () => {
  const projectsDelegate = require('./projects');
  const config = require(__base + 'config');
  expect(projectsDelegate).toBeDefined();
});

test('getByRequester for undefined requester returns 0 rows', async () => {
  const projectsDelegate = require('./projects');
  const res = await projectsDelegate.getByRequester(1);
  expect(res.meta.count).toBe(0);
});
