// Populate the database with test accounts for all 3 roles.

 /** Accounts created:
 *   SUPERADMIN  →  superadmin@delegation.com   /  SuperAdmin@123
 *   ADMIN 1     →  admin1@delegation.com        /  Admin@123
 *   ADMIN 2     →  admin2@delegation.com        /  Admin@123
 *   USER 1      →  user1@delegation.com         /  User@123
 *   USER 2      →  user2@delegation.com         /  User@123
 *   USER 3      →  user3@delegation.com         /  User@123
 */

import mysql from 'mysql2/promise';
import argon2 from 'argon2';
import dotenv from 'dotenv';
dotenv.config({quiet: true});

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT) || 3306,
    database: process.env.MYSQL_DB,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    waitForConnections: true,
    connectionLimit: 3,
    ssl: false,  // free hosts do not support SSL
});

// Seed accounts
const accounts = [
    // superadmin
    { name: 'Super Admin',   email: 'superadmin@delegation.com', password: 'SuperAdmin@123', role: 'superadmin' },

    // admins — created by superadmin
    { name: 'Rahul Admin',   email: 'admin1@delegation.com',     password: 'Admin@123',      role: 'admin' },
    { name: 'Sneha Admin',   email: 'admin2@delegation.com',     password: 'Admin@123',      role: 'admin' },

    // users — created by admin
    { name: 'Gaurav Kumar',  email: 'user1@delegation.com',      password: 'User@123',       role: 'user' },
    { name: 'Priya Sharma',  email: 'user2@delegation.com',      password: 'User@123',       role: 'user' },
    { name: 'Amit Verma',    email: 'user3@delegation.com',      password: 'User@123',       role: 'user' },
];

const seed = async () => {
    console.log('\n Starting database seed...\n');

    const conn = await pool.getConnection();

    try {
        let inserted = 0;
        let skipped  = 0;

        for (const acc of accounts) {
            // Skip if email already exists
            const [existing] = await conn.execute(
                'SELECT id FROM users WHERE email = ? LIMIT 1',
                [acc.email]
            );

            if (existing.length > 0) {
                console.log(`Skipped >>  [${acc.role.padEnd(10)}] ${acc.email}  (already exists)`);
                skipped++;
                continue;
            }

            const hashed = await argon2.hash(acc.password);
            await conn.execute(
                'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
                [acc.name, acc.email, hashed, acc.role]
            );
            console.log(`Created:  [${acc.role.padEnd(10)}] ${acc.email}`);
            inserted++;
        }

        console.log(`\n Seed complete!  ${inserted} inserted, ${skipped} skipped.\n`);
        console.log('─────────────────────────────────────────────────');
        console.log('  Role        Email                       Password');
        console.log('─────────────────────────────────────────────────');
        for (const a of accounts) {
            console.log(`  ${a.role.padEnd(11)} ${a.email.padEnd(32)} ${a.password}`);
        }
        console.log('─────────────────────────────────────────────────\n');
    } catch (err) {
        console.error('\n Seed failed:', err.message);
        process.exit(1);
    } finally {
        conn.release();
        await pool.end();
    }
};

seed();
