const express = require('express');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:publicRoutes');


const publicRouter = express.Router();

function router(nav) {
  // public router
  publicRouter.route('/')
    .get((req, res) => {
      const url = 'mongodb://180038020:aston1234@ds013206.mlab.com:13206/heroku_19bpkr91';
      const dbName = 'heroku_19bpkr91';

      (async function mongo() {
        let client = new MongoClient(url, { useNewUrlParser: true });
        try {
          client = await MongoClient.connect(url);
          debug('Connected correctly to the server');

          const db = client.db(dbName);

          const col = db.collection('items');

          const items = await col.find().toArray();
          res.render('public',
            {
              nav: [{ link: '/', title: 'Home' },
                { link: '/public', title: 'View Items' },
                { link: '/auth/signin', title: 'Sign In' },
                { link: '/admin', title: 'Admin' }],
              title: 'Find the Lost',
              items
            });
        } catch (err) {
          debug(err.stack);
        }
        client.close();
      }());
    });
  return publicRouter;
}


module.exports = router;
