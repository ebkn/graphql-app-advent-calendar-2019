CREATE TABLE tasks (
  id         INT NOT NULL AUTO_INCREMENT,
  title      varchar(255) NOT NULL,
  notes      text NOT NULL,
  completed  tinyint(1) NOT NULL DEFAULT 0,
  due        timestamp NULL DEFAULT NULL,
  created_at timestamp NULL DEFAULT NULL,
  updated_at timestamp NULL DEFAULT NULL,
  deleted_at timestamp NULL DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB;
