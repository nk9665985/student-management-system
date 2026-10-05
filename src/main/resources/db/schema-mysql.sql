-- spring.sql.init.mode=always means this file re-runs on every startup, so
-- it needs to be safe to run repeatedly: drop-then-recreate, same as it
-- effectively behaves today against the in-memory H2 database. That also
-- means every restart resets the data back to the seed rows in
-- data-mysql.sql. If you'd rather your data survive restarts, set
-- spring.sql.init.mode=never in application-mysql.properties once you've
-- seeded the database the first time.
--
-- "users" is deliberately NOT dropped here (create table IF NOT EXISTS
-- instead) - unlike the demo student/project data, registered accounts
-- should survive a restart, not reset every time.
drop table if exists projects;
drop table if exists students;

create table students (
	id bigint not null auto_increment,
	first_name varchar(50) not null,
	last_name varchar(50) not null,
	date_of_birth date not null,
	email varchar(254) not null,
	index_number integer not null,
	is_on_budget boolean not null,
	primary key (id)
);

create table projects (
	id bigint not null auto_increment,
	project_name varchar(50) not null,
	project_description varchar(255) not null,
	student_id bigint,
	primary key (id)
);

create table if not exists users (
	id bigint not null auto_increment,
	username varchar(50) not null unique,
	password varchar(255) not null,
	primary key (id)
);
