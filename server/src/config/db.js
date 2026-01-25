const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config({ quiet: true });

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Promisify for Node.js async/await
const promisePool = pool.promise();

const connectDB = async () => {
  try {
    const connection = await promisePool.getConnection();
    console.log('✅ MySQL Database Connected Successfully');
    connection.release();
  } catch (error) {
    if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('⚠️ Database not found. Creating database...');
      try {
        const tempConnection = await mysql.createConnection({
          host: process.env.DB_HOST,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
        });
        const promiseTemp = tempConnection.promise();
        await promiseTemp.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
        await promiseTemp.end();
        console.log(`✅ Database '${process.env.DB_NAME}' created successfully.`);
        // Retry connection
        return connectDB();
      } catch (createError) {
        console.error('❌ Failed to create database:', createError);
        process.exit(1);
      }
    } else {
      console.error('❌ Database Connection Failed:', error);
      process.exit(1);
    }
  }
};

module.exports = {
  pool: promisePool,
  connectDB
};
