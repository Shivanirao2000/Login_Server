const { Client } = require('pg');

// require('dotenv').config();
const connectionString = `postgres://postgres:123456@localhost:5432/Userdb`;

const client = new Client({
  connectionString,
});
client
  .connect()
  .then(() => console.log('DB Running'))
  .catch((err) => console.log(err));
module.exports = client