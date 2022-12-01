function addCSRFToken(req, res, next) {
  res.locals.csrfToken = req.csrfToken(); // the package csurf supports this method
  next();
}

module.exports = addCSRFToken;