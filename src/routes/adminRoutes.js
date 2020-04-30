const express = require('express');
const passport = require('passport');
const { MongoClient, ObjectID } = require('mongodb');
const debug = require('debug')('app:adminRoutes');


const adminRouter = express.Router();

function router(nav) {
  adminRouter.route('/')
    .get((req, res) => {
      res.render('adminSignin',
        {
          nav: [{ link: '/', title: 'Home' },
            { link: '/public', title: 'View Items' },
            { link: '/auth/signin', title: 'Sign In' },
            { link: '/admin', title: 'Admin' }],
          title: 'Sign In'
        });
    });
  adminRouter.route('/signin')
    .get((req, res) => {
      res.render('signin', {
        nav,
        title: 'Admin Sign In'
      });
    })
    .post(passport.authenticate('local.admin', {
      successRedirect: '/admin/profile',
      failureRedirect: '/'
    }));

  adminRouter.route('/profile')
    .get((req, res) => {
      debug(req.body);
      const url = 'mongodb+srv://180038020:aston@cluster0-is3sf.mongodb.net/test?retryWrites=true&w=majority';

      const dbName = 'filoApp';

      (async function mongo() {
        let client = new MongoClient(url, { useNewUrlParser: true });
        try {
          client = await MongoClient.connect(url);
          debug('Connected correctly to the server');

          const db = client.db(dbName);

          const col = db.collection('items');

          const items = await col.find({ waitingApproval: { $eq: true } }).toArray();

          debug(items);

          res.render('admin',
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

  adminRouter.route('/profile/approve')
    .get((req, res) => {
      res.render('approvalForm', {
        nav,
        title: 'Approve Item'
      });
    });
  adminRouter.route('/profile/approve/submit')
    .post((req, res) => {
      const {
        itemName
      } = req.body;
      debug(req.body);
      const url = 'mongodb+srv://180038020:aston@cluster0-is3sf.mongodb.net/test?retryWrites=true&w=majority';
      const dbName = 'filoApp';

      (async function addItem() {
        let client = new MongoClient(url, { useNewUrlParser: true });
        try {
          client = await MongoClient.connect(url);
          debug('Connected correctly to server');

          const db = client.db(dbName);

          const col = db.collection('items');
          const results = await col.findOneAndUpdate(
            { name: itemName },
            { $set: { waitingApproval: false, approved: true } }
          );
          debug(results);
          res.redirect('/admin/profile');
        } catch (err) {
          debug(err);
        }
        client.close();
      }());
    });

  adminRouter.route('/profile/refuse')
    .get((req, res) => {
      res.render('refusalForm', {
        nav,
        title: 'Refuse Item'
      });
    });

  adminRouter.route('/profile/refuse/submit')
    .post((req, res) => {
      const {
        itemName
      } = req.body;
      const url = 'mongodb+srv://180038020:aston@cluster0-is3sf.mongodb.net/test?retryWrites=true&w=majority';
      const dbName = 'filoApp';

      (async function addItem() {
        let client = new MongoClient(url, { useNewUrlParser: true });
        try {
          client = await MongoClient.connect(url);
          debug('Connected correctly to server');

          const db = client.db(dbName);

          const col = db.collection('items');
          const results = await col.findOneAndUpdate(
            { name: itemName },
            { $set: { waitingApproval: false, approved: false } }
          );
          debug(results);
          res.redirect('/admin/profile');
        } catch (err) {
          debug(err);
        }
        client.close();
      }());
    });

  adminRouter.route('/profile/:id')
    .get((req, res) => {
      const { id } = req.params;
      debug(typeof id);
      const url = 'mongodb+srv://180038020:aston@cluster0-is3sf.mongodb.net/test?retryWrites=true&w=majority';
      const dbName = 'filoApp';

      (async function mongo() {
        let client = new MongoClient(url, { useNewUrlParser: true });
        try {
          client = await MongoClient.connect(url);
          debug('Connected correctly to server');

          const db = client.db(dbName);

          const col = await db.collection('items');

          const item = await col.findOne({ _id: new ObjectID(id) });
          debug(item);

          res.render(
            'adminEditItem',
            {
              nav,
              title: 'Find the Lost',
              item
            }
          );
        } catch (err) {
          debug(err.stack);
        }
        client.close();
      }());
    });

  adminRouter.route('/profile/submit')
    .post((req, res) => {
      const {
        itemName, itemCategory, dateFound, user, locationFound, itemColour, itemDescription
      } = req.body;
      const url = 'mongodb+srv://180038020:aston@cluster0-is3sf.mongodb.net/test?retryWrites=true&w=majority';
      const dbName = 'filoApp';

      (async function addItem() {
        let client = new MongoClient(url, { useNewUrlParser: true });
        try {
          client = await MongoClient.connect(url);
          debug('Connected correctly to server');

          const db = client.db(dbName);

          const col = db.collection('items');

          const results = await col.findOneAndUpdate(
            { name: itemName },
            {
              $set:
              {
                name: itemName,
                category: itemCategory,
                date: dateFound,
                userRequested: user,
                location: locationFound,
                colour: itemColour,
                description: itemDescription,
              }
            }
          );
          debug(results);
          res.redirect('/admin/profile');
        } catch (err) {
          debug(err);
        }
        client.close();
      }());
    });

  return adminRouter;
}
module.exports = router;
