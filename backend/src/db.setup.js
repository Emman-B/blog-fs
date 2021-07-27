/**
 * This is a source file for setting up the database. This is primarily meant
 * for testing, allowing for easy regeneration of dummy data as well as resetting the
 * entire database. Thus, this should not be used in any production environment.
 * 
 * If no arguments are provided, the database will be set up (equivalent to: 
 * "npm run dbsetup -- --setup").
 */

// setup the .env file
require('dotenv').config();
// postgresql module
const { Pool } = require('pg');
// filesystem module
const fs = require('fs');
// module for parsing arguments
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

// == VARIABLES ==
const usageString = 'Usage: npm run dbsetup -- [-s|--setup] [-d|--dummy] [--dangerous=clear]';

// == yargs PARSING ==
const argv = yargs(hideBin(process.argv))
    .usage(usageString)
    .options({
      setup: {
        alias: 's',
        description: 'Sets up the tables in the database',
      },
      dummy: {
        alias: 'd',
        description: 'Inserts the dummy data',
      },
      "dangerous=clear": {
        description: 'Clears the database',
      },
    })
    .help()
    .argv;

// == CHECKS BEFORE DATABASE CONNECTION ==
// If the node environment is set to production, then exit the process while logging a message
if (process.env.NODE_ENV === 'production') {
  console.log('You appear to be in a production environment (NODE_ENV).' +
      ' Please change this in the ".env" file if you wish to use dbsetup.');
  process.exit();
}

// If no arguments were provided, set setup flag to true and continue
if (hideBin(process.argv).length === 0) {
  argv.setup = true;
}

// == DATABASE CONNECTION ==
// create a connection to the database
const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});


// connect to the database
pool.connect()
    .then(async (pool) => {
      // Flag for clearing the entire database
      if (argv.dangerous === 'clear') {
        const clearQuery = `DROP TABLE IF EXISTS blogposts; DROP TABLE IF EXISTS users;`;
        await pool.query({text: clearQuery});
        console.log('Database has been cleared.');
        process.exit();
      }

      // Flag for doing a simple setup
      if (argv.setup) {
        try {
          const setupQuery = fs.readFileSync('./sql/setup.sql', {encoding: 'utf-8'});
          await pool.query({text: setupQuery});
          console.log('Database has been setup');
          process.exit();
        }
        catch (err) {
          console.error('[ERROR] Database was not setup.');
          console.error(err);
        }
      }

      // Flag for generating dummy data, which should only be called once and done after a setup
      if (argv.dummy) {
        try {
          const dummyQuery = fs.readFileSync('./sql/dummydata.sql', {encoding: 'utf-8'});
          await pool.query({text: dummyQuery});
          console.log('Dummy data has been provided');
        }
        catch (err) {
          console.error('[ERROR] Dummy data was not provided. It may be due to running the --dummy command twice.');
          console.error(err);
        }
        finally {
          process.exit();
        }
      }
    })
    .catch(() => {
      console.error('[ERROR] Database connection failed.');
      process.exit();
    });
