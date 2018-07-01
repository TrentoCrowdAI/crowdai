const scopes = {
  JOBS: 'jobs',
  PROFILE: 'profile',
  PROJECTS: 'projects',
  REPORTS: 'reports'
};

const FileFormats = {
  PLAIN_TEXT: 'PLAIN TEXT',
  HTML: 'HTML',
  MARKDOWN: 'MARKDOWN'
};

const JobStatus = {
  NOT_PUBLISHED: 'NOT_PUBLISHED',
  PUBLISHED: 'PUBLISHED',
  DONE: 'DONE'
};

const AbstractPresentationTechniques = {
  kh: 'Keyword highlighting',
  ts: 'Text summarization'
};

const LabelOptions = {
  yn: 'Yes | No',
  ynk: 'Yes | No | I do not know',
  yns: 'Yes | No | I am not sure'
};

// const AggregationStrategies = {
//   mv: 'Majority Voting',
//   tf: 'Truth Finder',
//   ds: 'Dawid & Skene',
//   sums: 'SUMS',
//   inv: 'Investment',
//   avg: 'Average-log'
// };

const ShortestRunStatus = {
  INITIAL: 'INITIAL',
  BASELINE_GENERATED: 'BASELINE_GENERATED',
  ASSIGN_FILTERS: 'ASSIGN_FILTERS',
  FILTERS_ASSIGNED: 'FILTERS_ASSIGNED',
  UPDATED: 'UPDATED',
  DONE: 'DONE'
};

// name of the strategies registered in the backend.
const RegisteredTaskAssignmentStrategies = {
  SHORTEST_RUN: 'Shortest Run',
  BASELINE: 'Baseline'
};

const UserModes = {
  Author: 'Author',
  Researcher: 'Researcher'
};

const ResultOutcomes = {
  OUT: 'OUT',
  IN: 'IN',
  STOPPED: 'STOPPED'
};

const JobEstimationStatus = {
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE',
  NONE: 'NONE'
};

export {
  scopes,
  FileFormats,
  JobStatus,
  AbstractPresentationTechniques,
  LabelOptions,
  ShortestRunStatus,
  RegisteredTaskAssignmentStrategies,
  UserModes,
  ResultOutcomes,
  JobEstimationStatus
};
