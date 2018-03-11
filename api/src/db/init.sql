-- database initialization script for crowdrev

-- data: {}
CREATE TABLE requester (
  id bigserial NOT NULL,
  created_at timestamp,
  updated_at timestamp,
  deleted_at timestamp,
  data JSONB,
  CONSTRAINT pk_requester PRIMARY KEY (id)
);

CREATE TABLE project (
  id bigserial NOT NULL,
  requester_id bigint NOT NULL,
  created_at timestamp,
  updated_at timestamp,
  deleted_at timestamp,
  data JSONB,
  CONSTRAINT pk_project PRIMARY KEY (id)
);

CREATE TABLE experiment (
  id bigserial NOT NULL,
  project_id bigint NOT NULL,
  uuid varchar(255) NOT NULL,
  created_at timestamp,
  updated_at timestamp,
  deleted_at timestamp,
  data JSONB,
  CONSTRAINT pk_experiment PRIMARY KEY (id),
  CONSTRAINT uniq_experiment_uuid unique (uuid)
);

CREATE TABLE worker (
  id bigserial NOT NULL,
  turk_id varchar(255) NOT NULL,
  created_at timestamp,
  updated_at timestamp,
  deleted_at timestamp,
  data JSONB,
  CONSTRAINT pk_worker PRIMARY KEY (id),
  CONSTRAINT uniq_turk_id unique (turk_id)
);

-- data: {criteria: [c1_id, c2_id], finished: true, assignmentEnd: ...}
CREATE TABLE worker_assignment (
  id bigserial NOT NULL,
  experiment_id bigint,
  experiment_uuid varchar(255),
  worker_id bigint NOT NULL,
  created_at timestamp,
  updated_at timestamp,
  deleted_at timestamp,
  data JSONB,
  CONSTRAINT pk_worker_assignment PRIMARY KEY (id)
);

CREATE TABLE item (
  id bigserial NOT NULL,
  project_id bigint NOT NULL,
  created_at timestamp,
  updated_at timestamp,
  deleted_at timestamp,
  data JSONB,
  CONSTRAINT pk_item PRIMARY KEY (id)
);

-- data: {description: ''}
CREATE TABLE criterion (
  id bigserial NOT NULL,
  project_id bigint NOT NULL,
  created_at timestamp,
  updated_at timestamp,
  deleted_at timestamp,
  data JSONB,
  CONSTRAINT pk_criterion PRIMARY KEY (id)
);

-- data: {item: {title: '', description: ''}, criteria: [{id: 1, description: '', answer: 'yes'}]}
CREATE TABLE test (
  id bigserial NOT NULL,
  project_id bigint NOT NULL,
  created_at timestamp,
  updated_at timestamp,
  deleted_at timestamp,
  data JSONB,
  CONSTRAINT pk_test PRIMARY KEY (id)
);

-- a task is related to one item only, but can be related to more than one criterion. So
-- we store criteria in data attribute to make it flexible.
-- data: {criteria: [{id: 1, ... , workerAnswer: ''}], answered: true}
CREATE TABLE task (
  id bigserial NOT NULL,
  experiment_id bigint NOT NULL,
  item_id bigint NOT NULL,
  worker_id bigint NOT NULL,
  created_at timestamp,
  updated_at timestamp,
  deleted_at timestamp,
  data JSONB,
  CONSTRAINT pk_task PRIMARY KEY (id)
);

-- data: {initial: true, answered: true, criteria: [{id: 1, ... , answer: '', workerAnswer: ''}]}
CREATE TABLE test_task (
  id bigserial NOT NULL,
  experiment_id bigint NOT NULL,
  test_id bigint NOT NULL,
  worker_id bigint NOT NULL,
  created_at timestamp,
  updated_at timestamp,
  deleted_at timestamp,
  data JSONB,
  CONSTRAINT pk_test_task PRIMARY KEY (id)
);