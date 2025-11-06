//creates and exports a reusable PostgreSQL connection pool
// using the pg library and environment variables loaded via dotenv

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

console.log("Verbinde mit Datenbank auf Port:", process.env.DB_PORT);

module.exports = pool;
