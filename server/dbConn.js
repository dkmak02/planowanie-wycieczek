const pgp = require('pg-promise')();

require('dotenv').config();

const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;

const connection = {
  host: dbHost,    
  port: dbPort,         
  database: dbName,     
  user: dbUser,       
  password: dbPassword        
};

const db = pgp(connection);
module.exports = db

