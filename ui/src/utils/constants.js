const scopes = {
  EXPERIMENTS: 'experiments',
  PROFILE: 'profile',
  PROJECTS: 'projects'
};

const FileFormats = {
  PLAIN_TEXT: 'PLAIN TEXT',
  HTML: 'HTML',
  MARKDOWN: 'MARKDOWN'
};

const ExperimentStatus = {
  NOT_PUBLISHED: 'NOT_PUBLISHED',
  PUBLISHED: 'PUBLISHED',
  DONE: 'DONE'
};

const CrowdsourcingStrategies = {
  baseline: 'Baseline',
  mr: 'Multi-run',
  sr: 'Shortest run'
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

const AggregationStrategies = {
  mv: 'Majority Voting',
  tf: 'Truth Finder',
  ds: 'Dawid & Skene',
  sums: 'SUMS',
  inv: 'Investment',
  avg: 'Average-log'
};

export {
  scopes,
  FileFormats,
  ExperimentStatus,
  CrowdsourcingStrategies,
  AbstractPresentationTechniques,
  LabelOptions,
  AggregationStrategies
};
