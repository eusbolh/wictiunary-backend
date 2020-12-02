const router = require("express").Router();

const passport = require("passport");
const bcrypt = require("bcrypt-nodejs");

const User = require("../models/user.model");

const ObjectUtil = require("../common/utils/ObjectUtil");

router.route("/login").post((req, res, next) => {
  console.log("Inside POST /login callback function");
  passport.authenticate("local", (error, user, info) => {
    console.log("Inside passport.authenticate() callback");
    console.log(
      `req.session.passport: ${JSON.stringify(req.session.passport)}`
    );
    console.log(`req.user: ${JSON.stringify(req.user)}`);

    console.log(error, user, info);

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

  let encryptedPassword;
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(password, salt, null, (err, hash) => {
      if (!err) {
        encryptedPassword = hash;

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
  if (req.isAuthenticated()) {
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
    // TODO: check if it is possible that code reaches here
  } else {
    res.status(401).send();
  }
});

module.exports = router;
