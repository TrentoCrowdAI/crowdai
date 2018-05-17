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

-- data: {
--   itemsUrl: <string>,
--   testsUrl: <string>,
--   itemsCreated: <boolean>,
--   testsCreated: <boolean>
-- }
CREATE TABLE project (
  id bigserial NOT NULL,
  created_at timestamp,
  updated_at timestamp,
  deleted_at timestamp,
  data JSONB,
  CONSTRAINT pk_project PRIMARY KEY (id)
);

-- data: {
--   start: <date>,
--   end: <date>,
--   status: <string> NOT_PUBLISHED | PUBLISHED | DONE,
--   instructions: {
--     C1_LABEL: {taskInstructionsUrl: <string>, format: <string>, content: <string>},
--     C2_LABEL: {taskInstructionsUrl: <string>, format: <string>, content: <string>} 
--   }
--   ...
-- }
CREATE TABLE job (
  id bigserial NOT NULL,
  requester_id bigint NOT NULL,
  project_id bigint NOT NULL,
  uuid varchar(255) NOT NULL,
  created_at timestamp,
  updated_at timestamp,
  deleted_at timestamp,
  data JSONB,
  CONSTRAINT pk_job PRIMARY KEY (id),
  CONSTRAINT uniq_job_uuid unique (uuid)
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

-- data: {
--   criteria: [<number>, <number>], 
--   start: <date>, 
--   end: <date>,
--   finished: <boolean>, the worker is done.
--   finishedByWorker: <boolean>, the worker decided to finish early.
--   finishedWithError: <boolean>, means an error occurred and the worker was force to finish the task.
--   solvedMinTasks: <boolean>, means that the worker solved at least the minimum number of tasks required.
--   assignmentApproved: <boolean>,  means we approved the worker assignment.
--   assignmentBonusSent: <boolean>, means we paid the worker.
--   honeypotFailed: <boolean>
--   initialTestFailed: <boolean>
-- }
CREATE TABLE worker_assignment (
  id bigserial NOT NULL,
  job_id bigint,
  job_uuid varchar(255),
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

-- data: {
--   description: <string>, 
--   label: <string>
-- }
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
  job_id bigint NOT NULL,
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
  job_id bigint NOT NULL,
  test_id bigint NOT NULL,
  worker_id bigint NOT NULL,
  created_at timestamp,
  updated_at timestamp,
  deleted_at timestamp,
  data JSONB,
  CONSTRAINT pk_test_task PRIMARY KEY (id)
);

-- this table stores the task assignment algorithms that
-- the are integrated with the platform.
CREATE TABLE task_assignment_api (
  id bigserial NOT NULL,
  requester_id bigint,
  created_at timestamp,
  updated_at timestamp,
  deleted_at timestamp,
  name varchar(255),
  url  text,
  aggregation boolean, -- true -> aggregation is also included. false -> does not include aggregation.
  CONSTRAINT pk_task_assignment_api PRIMARY KEY (id)
);


-- helper function to compute the number of votes of an item.
CREATE OR REPLACE FUNCTION compute_item_votes(p_job_id bigint, p_item_id bigint, p_criteria_id bigint) RETURNS int AS $$
DECLARE v_votes int;
DECLARE v_criteria_filter text;
BEGIN
	v_criteria_filter := '{"criteria" : [{"id": "'||p_criteria_id||'"}]}';
    select count(t.*) into v_votes from task t
      where t.job_id = p_job_id
        and t.item_id = p_item_id
        and t.data @> v_criteria_filter::jsonb
        and (t.data ->> 'answered')::boolean = true;
    RETURN v_votes;
END;
$$ LANGUAGE plpgsql;