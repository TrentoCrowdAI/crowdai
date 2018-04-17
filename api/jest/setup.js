const fs = require('fs');
const { Client } = require('pg');

module.exports = async function() {
  global.__base = __dirname + '/../src/';
  const sql = fs.readFileSync(__base + 'db/init.sql', 'utf8');
  const config = require(__base + 'config');
  const db = require(__base + 'db');

  console.log(`\nSetup ${config.db.database} database.`);
  const client = new Client({
    database: config.db.user,
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password
  });
  await client.connect();
  await client.query(`create database "${config.db.database}"`);
  await client.end();
  await db.query(sql);
  console.log('Setup done');
};
