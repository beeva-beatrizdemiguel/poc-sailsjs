/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also do this by creating a hook.
 *
 * For more information on bootstrapping your app, check out:
 * https://sailsjs.com/config/bootstrap
 */

module.exports.bootstrap = async function(done) {

  if (process.env.NODE_ENV === 'production' || sails.config.models.migrate === 'safe') {
    sails.log.warn('Since we are running with migrate: \'safe\' and/or NODE_ENV=production (in the "' + sails.config.environment + '" Sails environment, to be precise), skipping the rest of the bootstrap to avoid data loss...');
    return done();
  }

  await sails.models.user.createEach([
    { name: 'admin', isAdmin: true, password: await sails.helpers.passwords.hashPassword('admin') },
  ]).fetch();

  return done();

};
