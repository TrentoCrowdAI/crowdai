/**
 * This module setup event listeners for projects-related events.
 */
const { on } = require('./emitter');
const projectsDelegate = require(__base + 'delegates/projects');
const { EventTypes } = require('./types');

/**
 * This listener generates the items, filters and tests records based
 * on the specified csv files by the given project. To emit this event
 * do the following:
 *
 * @example
 *
 * emit(EventTypes.PROCESS_CSV, project);
 */
on(EventTypes.project.PROCESS_CSV, async (project, truncate) => {
  await projectsDelegate.createRecordsFromCSVs(project, truncate);
});
