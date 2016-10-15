alter table users add status_updated_at timestamp default current_timestamp not null;
alter table users add latitude float;
alter table users add longitude float;

CREATE TABLE IF NOT EXISTS announcements (
	id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
	sender_id INT UNSIGNED NOT NULL,
	message TEXT NOT NULL,
	latitude FLOAT NULL,
	longitude FLOAT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL ON UPDATE CURRENT_TIMESTAMP,
	deleted_at TIMESTAMP NULL,
	FOREIGN KEY fk_sender(sender_id) REFERENCES users(id)
);