const router = require("express").Router();

const passport = require("passport");
const bcrypt = require("bcrypt-nodejs");

const User = require("../models/user.model");

const ObjectUtil = require("../common/utils/ObjectUtil");
const {
  BCRYPT_GEN_SALT_ROUNDS,
} = require("../common/constants/auth.constants");

router.route("/login").post((req, res, next) => {
  passport.authenticate("local", (error, user, info) => {
    if (info) {
      return res.send(info && info.message); // TODO: return proper http response
    }
    if (error) {
      return next(error);
    }
    if (!user) {
      return res.redirect("/login"); // TODO: return proper http response
    }

    req.login(user, (error) => {
      if (error) {
        return next(error);
      }

      const filteredUserObj = ObjectUtil.pick(user.toJSON(), [
        "email",
        "createdAt",
        "updatedAt",
      ]);

      return res.send(filteredUserObj);
    });
  })(req, res, next);
});

router.route("/register").post((req, res, next) => {
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

router.route("/me").get((req, res) => {
  const { user } = req;
  if (user) {
    const { email, createdAt, updatedAt } = user;
    // TODO: write a util for property picker
    res.status(200).send({
      email,
      createdAt,
      updatedAt,
    });
  }
});

module.exports = router;
