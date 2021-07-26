// express app
const app = require('./app');

// port to listen on
const PORT = parseInt(process.env.SERVER_PORT);

// database connection test
const { Client } = require('pg');
const dbTest = new Client({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

// listen on the specified port
app.listen(PORT, () => {
  console.log(`Backend is listening on port ${PORT}.`);

  // test the database
  let connectionTestString = 'Database connection test ';
  dbTest.connect()
    .then(() => {
      console.log(connectionTestString + 'succeeded.');
      dbTest.end();
    })
    .catch(() => {
      console.error(connectionTestString + 'failed.');
    });
});
