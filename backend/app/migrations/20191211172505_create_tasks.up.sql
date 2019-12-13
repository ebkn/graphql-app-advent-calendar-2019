CREATE TABLE tasks (
  id         INT NOT NULL AUTO_INCREMENT,
  identifier varchar(255) BINARY NOT NULL,
  title      varchar(255) NOT NULL,
  notes      text NOT NULL,
  completed  tinyint(1) NOT NULL DEFAULT 0,
  due        timestamp NULL DEFAULT NULL,
  created_at timestamp NOT NULL,
  updated_at timestamp NOT NULL,
  deleted_at timestamp NULL DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uix_tasks_identifier (identifier)
) ENGINE=InnoDB;
