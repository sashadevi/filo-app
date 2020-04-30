const express = require('express');
const { MongoClient, ObjectID } = require('mongodb');
const debug = require('debug')('app:registeredRoutes');

const registeredRouter = express.Router();

function router(nav) {
  registeredRouter.route('/')
    .get((req, res) => {
      const url = 'mongodb+srv://180038020:aston@cluster0-is3sf.mongodb.net/test?retryWrites=true&w=majority';
      const dbName = 'filoApp';

      (async function mongo() {
        const client = new MongoClient(uri, { useNewUrlParser: true });
        try {
          client = await MongoClient.connect(url);
          debug('Connected correctly to the server');

          const db = client.db(dbName);

          const col = db.collection('items');

          const items = await col.find({ approved: false }).toArray();

          debug(items);

          res.render('registered',
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

  registeredRouter.route('/additem')
    .get((req, res) => {
      res.render('additem', {
        nav,
        title: 'Add Item'
      });
    });
  registeredRouter.route('/submit')
    .post((req, res) => {
      const {
        name, category, date, username, location, colour, description
      } = req.body;
      const url = 'mongodb+srv://180038020:aston@cluster0-is3sf.mongodb.net/test?retryWrites=true&w=majority';
      const dbName = 'filoApp';

      (async function addItem() {
        const client = new MongoClient(uri, { useNewUrlParser: true });
        try {
          client = await MongoClient.connect(url);
          debug('Connected correctly to server');

          const db = client.db(dbName);

          const col = db.collection('items');

          const item = {
            name,
            category,
            date,
            username,
            location,
            colour,
            description,
            waitingApproval: false,
            approved: false,
            approvalDescription: '',
            userRequested: '',
          };
          const results = await col.insertOne(item);
          debug(results);
          res.redirect('/auth/registered');
        } catch (err) {
          debug(err);
        }
        client.close();
      }());
    });

  registeredRouter.route('/requestitem')
    .get((req, res) => {
      res.render('requestitem', {
        nav,
        title: 'Request Item'
      });
    });

  registeredRouter.route('/requestitem/submit')
    .post((req, res) => {
      const {
        itemName, description, userRequesting
      } = req.body;
      const url = 'mongodb+srv://180038020:aston@cluster0-is3sf.mongodb.net/test?retryWrites=true&w=majority';
      const dbName = 'filoApp';

      (async function addItem() {
        const client = new MongoClient(uri, { useNewUrlParser: true });
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
                approvalDescription: description,
                waitingApproval: true,
                userRequested: userRequesting
              }

            }
          );
          debug(results);
          res.redirect('/auth/registered');
        } catch (err) {
          debug(err);
        }
        client.close();
      }());
    });

  registeredRouter.route('/:id')
    .get((req, res) => {
      const { id } = req.params;
      debug(typeof id);
      const url = 'mongodb+srv://180038020:aston@cluster0-is3sf.mongodb.net/test?retryWrites=true&w=majority';
      const dbName = 'filoApp';

      (async function mongo() {
        const client = new MongoClient(uri, { useNewUrlParser: true });
        try {
          client = await MongoClient.connect(url);
          debug('Connected correctly to server');

          const db = client.db(dbName);

          const col = await db.collection('items');

          const item = await col.findOne({ _id: new ObjectID(id) });
          debug(item);

          res.render(
            'itemView',
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

  return registeredRouter;
}


module.exports = router;
