function pagination(req, res, next) {
  req.skip = 0;
  req.limit = null;
  if (req.query.page) {
    req.skip = (+req.query.page - 1)*(+req.query.per_page || 15);
    req.limit = +req.query.per_page || 15;
  }
  next();
}

module.exports = pagination;