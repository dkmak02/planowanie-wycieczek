const pgp = require('pg-promise')();
const dotenv = require('dotenv');
dotenv.config({ path: './process.env' });
require('dotenv').config();

const dbHost = process.env.DB_HOST || 'postgres';
const dbPort = process.env.DB_PORT || 5432;
const dbUser = process.env.DB_USER || 'tripplanner';
const dbPassword = process.env.DB_PASSWORD || 'yourpassword';
const dbName = process.env.DB_NAME || 'tripplanner_db';
const connection = {
  host: 'postgres',    
  port: dbPort,         
  database: dbName,     
  user: dbUser,       
  password: dbPassword        
};
console.log(connection);
const db = pgp(connection);
module.exports = db

