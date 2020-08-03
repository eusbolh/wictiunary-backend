const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const { v4: uuid } = require('uuid');
const session = require('express-session');
const SessionStore = require('session-file-store')(session);
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt-nodejs');

require('dotenv').config();

/* Establish MongoDB connection */
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully.');
});

/* Get db models */
const User = require('./models/user.model');

const users = [
  { id: '2f24vvg', email: 'test@test.com', password: 'password' },
];

// configure passport.js to use the local strategy
passport.use(new LocalStrategy(
  { usernameField: 'email' },
  (email, password, done) => {
    console.log('Inside local strategy callback');

    // Check if credentials are valid
    User
      .find({ email })
      .then((response) => {
        const user = response && response[0];
        if (!bcrypt.compareSync(password, user && user.password)) {
          return done(null, false, { message: 'Invalid credentials.\n' });
        }
        return done(null, user);
      })
      .catch((error) => {
        done(error);
      });
  }
));

// tell passport how to serialize the user
passport.serializeUser((user, done) => {
  console.log('Inside serializeUser callback. User id is save to the session file store here')
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  console.log('Inside deserializeUser callback');
  console.log(`The user id passport saved in the session file store is: ${id}`);
  
  // Fetch user data from db
  User
    .find({ id })
    .then((response) => {
      const user = response && response[0];
      if (user) {
        done(null, user);
      } else {
        done('User not found', false);
      }
    })
    .catch((error) => {
      done(error, false);
    });
});

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
  genid: (req) => {
    console.log('Inside the session middleaware');
    console.log(req.sessionID);
    return uuid();
  },
  store: new SessionStore(),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  console.log('Inside the homepage callback function');
  console.log(req.sessionID);
  res.send(`magical songs of enchantment: ${req.sessionID}\n`);
});

/* login routes */

app.get('/login', (req, res) => {
  console.log('Inside GET /login callback function');
  console.log(req.sessionID);
  res.send('i guess it should be the login page!\n');
});

app.post('/login', (req, res, next) => {
  console.log('Inside POST /login callback function');
  passport.authenticate('local', (error, user, info) => {
    console.log('Inside passport.authenticate() callback');
    console.log(`req.session.passport: ${JSON.stringify(req.session.passport)}`);
    console.log(`req.user: ${JSON.stringify(req.user)}`);

    if (info) {
      return res.send(info && info.message); // TODO: return proper http response
    }
    if (error) {
      return next(error);
    }
    if (!user) {
      return res.redirect('/login'); // TODO: return proper http response
    }

    req.login(user, (error) => {
      if (error) {
        return next(error);
      }
      return res.redirect('/authrequired'); // TODO: return proper http response
    });
  })(req, res, next);
});

app.post('/login', (req, res, next) => {
  console.log('Inside POST /login callback')
  passport.authenticate('local', (err, user, info) => {
    console.log('Inside passport.authenticate() callback');
    console.log(`req.session.passport: ${JSON.stringify(req.session.passport)}`)
    console.log(`req.user: ${JSON.stringify(req.user)}`)
    req.login(user, (err) => {
      console.log('Inside req.login() callback')
      console.log(`req.session.passport: ${JSON.stringify(req.session.passport)}`)
      console.log(`req.user: ${JSON.stringify(req.user)}`)
      return res.send('You were authenticated & logged in!\n');
    })
  })(req, res, next);
});

app.get('/authrequired', (req, res) => {
  console.log('Inside GET /authrequired callback');
  console.log(`User authenticated? ${req.isAuthenticated()}`);
  if(req.isAuthenticated()) {
    res.send('you hit the authentication endpoint\n');
  } else {
    res.redirect('/');
  }
});

/* start listening port */

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});