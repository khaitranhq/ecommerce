'use strict';

const Dotenv = require('dotenv');
const Confidence = require('confidence');
const Toys = require('toys');

// Pull .env into process.env
Dotenv.config({ path: `${__dirname}/.env` });

// Glue manifest as a confidence store
module.exports = new Confidence.Store({
  server: {
    host: 'localhost',
    port: { $env: 'PORT', $coerce: 'number', $default: 3000 },
    debug: {
      $filter: { $env: 'NODE_ENV' },
      $default: { log: ['error'], request: ['error'] },
      production: { request: ['implementation'] }
    }
  },
  register: {
    plugins: [
      {
        plugin: '../lib', // Main plugin
        options: {}
      },
      {
        plugin: {
          $filter: { $env: 'NODE_ENV' },
          $default: 'hpal-debug',
          production: Toys.noop
        }
      },
      {
        plugin: 'schwifty',
        options: {
          $filter: { $env: 'NODE_ENV' },
          $default: {},
          $base: {
            migrateOnStart: true,
            knex: {
              client: 'pg',
              connection: {
                host: { $env: 'PG_HOST' },
                port: { $env: 'PG_PORT' },
                user: { $env: 'PG_USER' },
                password: { $env: 'PG_PASSWORD' },
                database: { $env: 'PG_DATABASE_TEST' },
                pool: { min: 0, max: 7 }
              }
            }
          },
          development: {
            migrateOnStart: true,
            knex: {
              client: 'pg',
              connection: {
                host: { $env: 'PG_HOST' },
                port: { $env: 'PG_PORT' },
                user: { $env: 'PG_USER' },
                password: { $env: 'PG_PASSWORD' },
                database: { $env: 'PG_DATABASE' },
                pool: { min: 0, max: 7 }
              },
              debug: true
            }
          },
          production: {
            migrateOnStart: false,
            knex: {
              client: 'pg',
              connection: {
                host: { $env: 'PG_HOST' },
                port: { $env: 'PG_PORT' },
                user: { $env: 'PG_USER' },
                password: { $env: 'PG_PASSWORD' },
                database: { $env: 'PG_DATABASE' },
                pool: { min: 0, max: 7 }
              }
            }
          }
        }
      }
    ]
  }
});
