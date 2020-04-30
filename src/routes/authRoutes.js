const express = require('express');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:authRoutes');
const passport = require('passport');

const authRouter = express.Router();

function router(nav) {
  authRouter.route('/signUp')
    .post((req, res) => {
      const { username, password, password2 } = req.body;
      const url = 'mongodb+srv://180038020:aston@cluster0-is3sf.mongodb.net/test?retryWrites=true&w=majority';
      const dbName = 'filoApp';

      (async function addUser() {
        let client;
        try {
          client = await MongoClient.connect(url);
          debug('Connected correctly to server');

          const db = client.db(dbName);

          const col = db.collection('users');

          if (password === password2) {
            const profile = { username, password, admin: false };
            const results = await col.insertOne(profile);
            debug(results);
            req.login(results.ops[0], () => {
              res.redirect('/auth/registered');
            });
          } else if (username === col.findOne({ username })) {
            res.redirect('/');
          } else {
            res.redirect('/');
          }
        } catch (err) {
          debug(err);
        }
      }());
    });
  authRouter.route('/signin')
    .get((req, res) => {
      res.render('signin',
        {
          nav: [{ link: '/', title: 'Home' },
            { link: '/public', title: 'View Items' },
            { link: '/auth/signin', title: 'Sign In' },
            { link: '/admin', title: 'Admin' }],
          title: 'Sign In'
        });
    })
    .post(passport.authenticate('local.registered', {
      successRedirect: '/auth/registered',
      failureRedirect: '/'
    }));
  return authRouter;
}

module.exports = router;
