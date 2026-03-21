import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config({ quiet: true });

// mysql connection pool
export const mysqlPool = mysql.createPool({
    host: process.env.MYSQL_HOST || 'localhost',
    port: process.env.MYSQL_PORT || 3306,
    database: process.env.MYSQL_DB || 'mysql_crud_db',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'password',
    waitForConnections: true,
    connectionLimit: 20, // Maximum number of connections in the pool
    queueLimit: 0, // No limit on queue size
    charset: 'utf8mb4', // Use UTF-8 character set
    // ssl: {
    //     rejectUnauthorized: !process.env.MYSQL_REJECTUNAUTHORIZED || process.env.MYSQL_REJECTUNAUTHORIZED === 'false'
    // }
});

// connect to database
export const connectDB = async () => {
    try {
        // Test the connection
        const connection = await mysqlPool.getConnection();

        // Log successful connection
        console.log(`✅ Database Connected: ${connection.config.host}:${connection.config.port}`);

        // Only visible in dev server
        if (process.env.NODE_ENV === 'development') {
            console.log(`📊 Database Name: ${connection.config.database}`);
            console.log(`👤 User: ${connection.config.user}`);
        }

        // Release the test connection back to the pool
        connection.release();

        // Handle pool errors
        mysqlPool.on('error', (err) => {
            console.error('❌ MySQL pool error:', err);
        });

        // Handle connection errors
        mysqlPool.on('connection', (connection) => {
            connection.on('error', (err) => {
                console.error('❌ MySQL connection error:', err);
            });
        });

        // Handle application termination signals
        process.on('SIGINT', async () => {
            await mysqlPool.end();
            console.log('📴 MySQL connection pool closed through app termination');
            process.exit(0);
        });

        process.on('SIGTERM', async () => {
            await mysqlPool.end();
            console.log('📴 MySQL connection pool closed through app termination');
            process.exit(0);
        });

    } catch (error) {
        console.error('❌ MySQL connection failed >> ', error.message);
        process.exit(1);
    }
};
