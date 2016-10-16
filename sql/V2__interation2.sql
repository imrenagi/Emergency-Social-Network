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

CREATE TABLE IF NOT EXISTS conversations (
	id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
	user1_id INT UNSIGNED NOT NULL,
	user2_id INT UNSIGNED NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL ON UPDATE CURRENT_TIMESTAMP,
	deleted_at TIMESTAMP NULL
);

CREATE TABLE IF NOT EXISTS private_messages (
	id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
	conversation_id INT UNSIGNED NOT NULL,
	message TEXT NOT NULL,
	sender_id INT UNSIGNED NOT NULL,
	receiver_id INT UNSIGNED NOT NULL,
	message_status VARCHAR(255) NULL,
	latitude FLOAT NULL,
	longitude FLOAT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL ON UPDATE CURRENT_TIMESTAMP,
	deleted_at TIMESTAMP NULL,
	FOREIGN KEY fk_conversation(conversation_id) REFERENCES users(id)
);

alter table private_messages add read_flag TINYINT DEFAULT 0;
ALTER TABLE private_messages MODIFY message_status TINYINT DEFAULT 0;
ALTER TABLE private_messages ADD sender_name VARCHAR(255) NOT NULL;
ALTER TABLE private_messages ADD receiver_name VARCHAR(255) NOT NULL;
