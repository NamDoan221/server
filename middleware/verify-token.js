const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const token = req.headers['x-access-token'];
  if (!token) {
    return res.status(403).send({ 
      status: 403,
      message: 'Vui lòng cung cấp access-token'
    });
  }
  jwt.verify(token, process.env.SECRET_TOKEN, (err, decoded) => {
    if (err) {
      return res.status(500).send({
        status: 500,
        message: 'Có lỗi phát sinh trong server'
      });
    }
    req.userId = decoded.id;
    req.isAdmin = decoded.isAdmin;
    next();
  });
}

module.exports = verifyToken;