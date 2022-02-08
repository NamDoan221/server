const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('../user/model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const verifyToken = require('../../middleware/verify-token');
// const rawBodySaver = require('../../middleware/raw-body-saver');

// router.use(bodyParser.json({ verify: rawBodySaver }));
// router.use(bodyParser.urlencoded({ verify: rawBodySaver, extended: true }));
// router.use(bodyParser.raw({ verify: rawBodySaver, type: '*/*' }));
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());


router.post('/register', async (req, res) => {
  try {
    const hashedPassword = bcrypt.hashSync(req.body.password, 8);
    req.body.password = hashedPassword;
    const user = await User.create(req.body);
    const jwt_data = {
      id: user._id,
      name: user.name,
      email: user.email,
      password: user.password,
      address: user.address,
      avatar: user.avatar,
      isAdmin: user.isAdmin
    }
    const token = jwt.sign(jwt_data, process.env.SECRET_TOKEN, {
      expiresIn: 86400
    });
    res.status(200).send({
      status: 200,
      token: token
    });
  } catch (error) {
    return res.status(500).send({
      status: 500,
      message: 'Có lỗi phát sinh trong server'
    });
  }
});

router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId, { password: 0 });
    if (!user) {
      return res.status(404).send({
        status: 404,
        message: 'User không tồn tại'
      });
    }
    res.status(200).send({
      status: 200,
      data: user
    });
  } catch (error) {
    return res.status(500).send({
      status: 500,
      message: 'Có lỗi phát sinh trong server'
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send({
        status: 404,
        message: 'Tài khoản hoặc mật khẩu không đúng'
      });
    }
    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) {
      return res.status(401).send({
        status: 401,
        message: 'Tài khoản hoặc mật khẩu không đúng'
      });
    }
    const jwt_data = {
      id: user._id,
      name: user.name,
      email: user.email,
      password: user.password,
      address: user.address,
      avatar: user.avatar,
      isAdmin: user.isAdmin
    }
    const token = jwt.sign(jwt_data, process.env.SECRET_TOKEN, {
      expiresIn: 86400
    });
    res.status(200).send({ status: 200, token: token });
  } catch (error) {
    return res.status(500).send({
      status: 500,
      message: 'Có lỗi phát sinh trong server'
    });
  }

});

router.get('/logout', (req, res) => {
  res.status(200).send({
    status: 200,
    token: null
  });
});

module.exports = router;