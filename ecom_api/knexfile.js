const Hoek = require('@hapi/hoek');
const Manifest = require('./server/manifest');

module.exports = {
  ...Manifest.get('/register/plugins', process.env).find(
    ({ plugin }) => plugin === 'schwifty'
  ).options.knex,
  migrations: { directory: './lib/migrations/' }
};
