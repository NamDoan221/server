const errors = require("./customer.validte");

module.exports.postCreate = function(req, res, next) {

  if (errors.errors(req).length) {
    res.render("users/create", {
      errors: errors.errors(req),
      values: req.body,
    });
    return;
  }
  next();
}