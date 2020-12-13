const router = require("express").Router();

const passport = require("passport");
const bcrypt = require("bcrypt-nodejs");

const User = require("../models/user.model");

const ObjectUtil = require("../common/utils/ObjectUtil");
const {
  BCRYPT_GEN_SALT_ROUNDS,
} = require("../common/constants/auth.constants");
const paths = require("./paths");

router.route(paths.AUTH_LOGIN.path).post((req, res, next) => {
  passport.authenticate("local", (error, user, info) => {
    if (info) {
      return res.send(info && info.message); // TODO: return proper http response
    }
    if (error) {
      return next(error);
    }

    req.login(user, (error) => {
      if (error) {
        return next(error);
      }

      return res.status(200).send();
    });
  })(req, res, next);
});

router.route(paths.AUTH_REGISTER.path).post((req, res, next) => {
  const { email, password } = req.body;

  bcrypt.genSalt(BCRYPT_GEN_SALT_ROUNDS, function (err, salt) {
    bcrypt.hash(password, salt, null, (err, hash) => {
      if (!err) {
        const encryptedPassword = hash;

        const user = new User({
          email,
          password: encryptedPassword,
        });

        user
          .save()
          .then(() => {
            res.json("User registered!");
          })
          .catch((err) => {
            res.status(400).json("Error: ", err);
          });
      }
    });
  });
});

router.route(paths.AUTH_ME.path).get((req, res) => {
  const { user } = req;

  const filteredUserObj = ObjectUtil.pick(user.toJSON(), [
    "email",
    "createdAt",
    "updatedAt",
  ]);

  return res.send(filteredUserObj);
});

module.exports = router;
