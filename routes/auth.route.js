const router = require("express").Router();

const passport = require("passport");
const bcrypt = require("bcrypt-nodejs");

const User = require("../models/user.model");

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
      return res.send(`${JSON.stringify(user)}\n`); // TODO: return proper http response (remove password from the object)
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

router.route("/test").get((req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).send("User is authenticated.");
  } else {
    res.status(401).send("User is not authenticated.");
  }
});

module.exports = router;
