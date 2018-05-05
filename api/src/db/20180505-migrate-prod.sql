-- make requester_id nullable in project table

alter table project alter column requester_id drop not null;

-- add column requester_id to job table
alter table job add column requester_id bigint;

-- fill in requester_id column based on the value on the project table
update job j set requester_id = p.requester_id
from (
  select * from project 
) as p
where j.project_id = p.id;

-- drop column requester_id in table project
alter table project drop column requester_id;

-- add not null constraint
alter table job ALTER COLUMN requester_id set not null;