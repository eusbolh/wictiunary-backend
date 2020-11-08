const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const { v4: uuid } = require("uuid");

// Session imports
const session = require("express-session");
const SessionStore = require("session-file-store")(session);

// Passport imports
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

// Encryption imports
const bcrypt = require("bcrypt-nodejs");

// Get dotenv
require("dotenv").config();

// Establish MongoDB connection
mongoose.connect(process.env.ATLAS_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully.");
});

// Get db models
const User = require("./models/user.model");

// configure passport.js to use the local strategy
passport.use(
  new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
    console.log("Inside local strategy callback");

    // Check if credentials are valid
    User.find({ email })
      .then((response) => {
        const user = response && response[0];
        if (!bcrypt.compareSync(password, user && user.password)) {
          return done(null, false, { message: "Invalid credentials.\n" });
        }
        return done(null, user);
      })
      .catch((error) => {
        done(error);
      });
  })
);

// tell passport how to serialize the user
passport.serializeUser((user, done) => {
  console.log(
    "Inside serializeUser callback. User id is save to the session file store here"
  );
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  console.log("Inside deserializeUser callback");
  console.log(`The user id passport saved in the session file store is: ${id}`);

  console.log(id);

  // Fetch user data from db
  User.find({ _id: id })
    .then((response) => {
      const user = response && response[0];
      if (user) {
        done(null, user);
      } else {
        done("User not found", false);
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

app.use(
  session({
    genid: (req) => {
      console.log("Inside the session middleaware");
      console.log(req.sessionID);
      return uuid();
    },
    store: new SessionStore(),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.status(200).send("Welcome to Wictiunary!");
});

/* login routes */

app.post("/register", (req, res, next) => {
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

app.post("/login", (req, res, next) => {
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

app.get("/authrequired", (req, res) => {
  console.log("Inside GET /authrequired callback");
  console.log(`User authenticated? ${req.isAuthenticated()}`);
  if (req.isAuthenticated()) {
    res.send("you hit the authentication endpoint\n");
  } else {
    res.status(401).send();
  }
});

/* start listening port */

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
