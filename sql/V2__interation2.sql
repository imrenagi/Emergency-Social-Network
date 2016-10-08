alter table users add status_updated_at timestamp default current_timestamp not null;
alter table users add latitude float;
alter table users add longitude float;