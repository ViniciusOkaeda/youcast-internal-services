const mysql = require('mysql2/promise');
require("dotenv").config();

 
const client = mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    waitForConnections: true
,});
 

async function selectCustomers() {
    const res = await client.query('SELECT * FROM usuarios');
    return res;
}
 
module.exports = { client }