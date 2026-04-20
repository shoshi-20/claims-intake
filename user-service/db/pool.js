// const pool = new Pool({
//   user: process.env.DB_USER || 'postgres',
//   password: process.env.DB_PASSWORD,
//   host: process.env.DB_HOST || 'localhost',
//   port: process.env.DB_PORT || 5432,
//   database: process.env.DB_NAME || 'claims_db',
// });

// pool.on('error', (err) => {
//   console.error('Unexpected error on idle client', err);
// });

// module.exports = pool;

// const { Pool } = require('pg');
// const pool = new Pool({
//     host: 'db',          // Docker Compose service name
//     port: 5432,
//     user: 'username',
//     password: 'password',
//     database: 'db123'
// });
// module.exports = pool;
import dotenv from 'dotenv';
dotenv.config();
import {Pool} from 'pg';
console.log('Connecting to DB with URL:', process.env.DATABASE_URL);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

export default pool;
