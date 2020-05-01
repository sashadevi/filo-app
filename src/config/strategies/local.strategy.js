const passport = require('passport');
const { Strategy } = require('passport-local');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:local.strategy');

module.exports = function localStrategy() {
  passport.use('local.registered', new Strategy(
    {
      usernameField: 'username',
      passwordField: 'password'
    }, (username, password, done) => {

      const url = 'mongodb://180038020:aston1234@ds013206.mlab.com:13206/heroku_19bpkr91';

      const dbName = 'heroku_19bpkr91';

      (async function usersMongo() {
       let client = new MongoClient(url, { useNewUrlParser: true });

        try {
          client = await MongoClient.connect(url);

          debug('Connected correctly to the server');

          const db = client.db(dbName);
          const col = db.collection('users');

          const user = await col.findOne({ username });

          if (user.password === password && user.admin === false) {
            done(null, user);
          } else {
            done(null, false);
          }
        } catch (err) {
          console.log(err.stack);
        }
        client.close();
      }());
    }
  ));

  passport.use('local.admin', new Strategy(
    {
      usernameField: 'username',
      passwordField: 'password'
    }, (username, password, done) => {
      const url = 'mongodb://180038020:aston1234@ds013206.mlab.com:13206/heroku_19bpkr91';
      const dbName = 'heroku_19bpkr91';

      (async function adminUsersMongo() {
        let client = new MongoClient(url, { useNewUrlParser: true });
        try {
          client = await MongoClient.connect(url);

          debug('Connected correctly to the server');

          const db = client.db(dbName);
          const col = db.collection('users');

          const user = await col.findOne({ username });

          if (user.password === password && user.admin === true) {
            done(null, user);
          } else {
            done(null, false);
          }
        } catch (err) {
          console.log(err.stack);
        }
        client.close();
      }());
    }
  ));
};
