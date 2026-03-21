// Run it once to create all tables on the hosted MySQL database.

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config({quiet:true});

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT || 3306,
    database: process.env.MYSQL_DB,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    waitForConnections: true,
    connectionLimit: 3,
    // ssl: process.env.MYSQL_REJECTUNAUTHORIZED === 'false'
    //     ? { rejectUnauthorized: false }
    //     : undefined,
});

const queries = [
    // TABLE: users
    `CREATE TABLE IF NOT EXISTS users (
        id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
        name       VARCHAR(100) NOT NULL,
        email      VARCHAR(150) NOT NULL,
        password   VARCHAR(255) NOT NULL,
        role       ENUM('superadmin','admin','user') NOT NULL DEFAULT 'user',
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY uq_users_email (email)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

    // TABLE: delegations
    `CREATE TABLE IF NOT EXISTS delegations (
        id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
        title       VARCHAR(200) NOT NULL,
        description TEXT NULL,
        assigned_to INT UNSIGNED NOT NULL,
        created_by  INT UNSIGNED NOT NULL,
        status      ENUM('pending','in-progress','completed') NOT NULL DEFAULT 'pending',
        created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        CONSTRAINT fk_del_assigned FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE CASCADE,
        CONSTRAINT fk_del_creator  FOREIGN KEY (created_by)  REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

    // TABLE: activity_logs
    `CREATE TABLE IF NOT EXISTS activity_logs (
        id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
        user_id    INT UNSIGNED NOT NULL,
        action     VARCHAR(255) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        CONSTRAINT fk_act_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
];

const run = async () => {
    console.log('\n Running database migration...');
    console.log(`   Host: ${process.env.MYSQL_HOST}`);
    console.log(`   DB  : ${process.env.MYSQL_DB}\n`);

    const conn = await pool.getConnection();

    try {
        for (const sql of queries) {
            // Extract table name for logging
            const tableName = sql.match(/CREATE TABLE IF NOT EXISTS (\w+)/i)?.[1] ?? '?';
            await conn.execute(sql);
            console.log(`Table "${tableName}" ready`);
        }

        console.log('\n Migration complete! All tables are ready.\n');
    } catch (err) {
        console.error('\n Migration failed:', err.message);
        process.exit(1);
    } finally {
        conn.release();
        await pool.end();
    }
};

run();
