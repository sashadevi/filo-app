const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'filo' }));
app.use(passport.initialize());
app.use(passport.session());

require('./src/config/passport.js')(app);

app.use(express.static(path.join(__dirname, '/public/')));
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/boostrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist')));
app.set('views', './src/views');
app.set('view engine', 'ejs');

const nav = [
  { link: '/public', title: 'Public' },
  { link: '/registered', title: 'Registered' },
  { link: '/admin', title: 'Admin' },
  { link: '/signup', title: 'Signup' }];

// routers
const publicRouter = require('./src/routes/publicRoutes')(nav);
const authRouter = require('./src/routes/authRoutes')(nav);
const adminRouter = require('./src/routes/adminRoutes')(nav);
const registeredRouter = require('./src/routes/registeredRoutes')(nav);

app.use('/public', publicRouter);
app.use('/auth', authRouter);
app.use('/auth/registered', registeredRouter);
app.use('/admin', adminRouter);


app.get('/', (req, res) => {
  res.render(
    'index',
    {
      nav: [{ link: '/', title: 'Home' },
        { link: '/public', title: 'View Items' },
        { link: '/auth/signin', title: 'Sign In' },
        { link: '/admin', title: 'Admin' }],
      title: 'Find the Lost'
    }
  );
});

app.listen(port, () => {
  debug(`Listening at port + ${chalk.green('3000')}`);
});
