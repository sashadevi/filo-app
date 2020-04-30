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

      const url = 'mongodb+srv://180038020:aston@cluster0-is3sf.mongodb.net/test?retryWrites=true&w=majority';

      const dbName = 'filoApp';

      (async function usersMongo() {
        const client = new MongoClient(url, { useNewUrlParser: true });

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
      let url = 'mongodb+srv://180038020:aston@cluster0-is3sf.mongodb.net/test?retryWrites=true&w=majority';
      const dbName = 'filoApp';

      (async function adminUsersMongo() {
        let client;

        try {
          const client = new MongoClient(url, { useNewUrlParser: true });

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
