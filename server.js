const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const { v4: uuid } = require('uuid');
const session = require('express-session');
const SessionStore = require('session-file-store')(session);

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
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

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully.');
});

app.get('/', (req, res) => {
  console.log('Inside the homepage callback function');
  console.log(req.sessionID);
  res.send(`magical songs of enchantment: ${req.sessionID}\n`);
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});