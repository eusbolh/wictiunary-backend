const User = require('../models/user.model');

const router = require('express').Router();
const User = require('../models/user.model');
const passport = require('passport');

router.route('/login').post((req, res, next) => {
  passport.authenticate('local', (err, user, info))
});

router.route('/register').post((req, res, next) => {
  
})