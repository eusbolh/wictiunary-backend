const paths = require("../routes/paths");

const ensureLoggedIn = (req, res, next) => {
  const requestPathObj = Object.values(paths).find(
    (pathObj) => pathObj.fullPath === req.path
  );
  const ensureLoggedIn = requestPathObj && requestPathObj.ensureLoggedIn;

  if (ensureLoggedIn && !req.isAuthenticated()) {
    res.status(401).send();
  } else {
    next();
  }
};

module.exports = ensureLoggedIn;
