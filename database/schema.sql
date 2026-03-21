-- Delegation Management System — MySQL Schema
-- Author: Er. Gaurav Kumar

-- CREATE DATABASE IF NOT EXISTS delegation_db
--   DEFAULT CHARACTER SET utf8mb4
--   DEFAULT COLLATE utf8mb4_unicode_ci;

-- USE delegation_db;

-- Do NOT run CREATE DATABASE / USING — free hosts provide one pre-assigned database.
-- Run via: node migrate.js  (recommended) OR paste below into phpMyAdmin.


-- TABLE: users
CREATE TABLE IF NOT EXISTS users (
  id          INT UNSIGNED      NOT NULL AUTO_INCREMENT,
  name        VARCHAR(100)      NOT NULL,
  email       VARCHAR(150)      NOT NULL,
  password    VARCHAR(255)      NOT NULL,
  role        ENUM('superadmin','admin','user') NOT NULL DEFAULT 'user',
  created_at  TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



-- TABLE: delegations
CREATE TABLE IF NOT EXISTS delegations (
  id          INT UNSIGNED      NOT NULL AUTO_INCREMENT,
  title       VARCHAR(200)      NOT NULL,
  description TEXT              NULL,
  assigned_to INT UNSIGNED      NOT NULL,
  created_by  INT UNSIGNED      NOT NULL,
  status      ENUM('pending','in-progress','completed') NOT NULL DEFAULT 'pending',
  created_at  TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_delegations_assigned FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_delegations_creator  FOREIGN KEY (created_by)  REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



-- TABLE: activity_logs
CREATE TABLE IF NOT EXISTS activity_logs (
  id          INT UNSIGNED      NOT NULL AUTO_INCREMENT,
  user_id     INT UNSIGNED      NOT NULL,
  action      VARCHAR(255)      NOT NULL,
  created_at  TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_activity_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



-- SEED: Default Super Admin
-- Password: Admin@1234  (argon2 hash — change after first login)
-- NOTE: Generate a real argon2 hash of your chosen password and
--       replace the value below before running in production.
INSERT IGNORE INTO users (name, email, password, role) VALUES (
  'Super Admin',
  'superadmin@delegation.com',
  '$argon2id$v=19$m=65536,t=3,p=4$+vXlLS7YIGZXbUWgn9WvvA$1nj6oRJ1fYqnDb28TJnoZqcJie50tYpRQ7EapHDlB8M',
  'superadmin'
);
