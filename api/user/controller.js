const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('./model');
const verifyToken = require('../../middleware/verify-token');
const pagination = require('../../middleware/pagination');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get('/', verifyToken, pagination, async (req, res) => {
  if (!req.isAdmin) {
    return res.status(401).send({
      status: 401,
      message: 'Bạn không có quyền truy cập chức năng này'
    });
  }
  const searchQuery = {
    name: { $regex: req.query.search || '', $options: 'i' },
    isAdmin: false
  };
  try {
    const users = await User.find(searchQuery).skip(req.skip).limit(req.limit);
    res.status(200).send({
      status: 200,
      data: users
    });
  } catch (error) {
    return res.status(500).send({
      status: 500,
      message: 'Có lỗi phát sinh trong server'
    });
  }
});

router.get('/:id', verifyToken, async (req, res) => {
  if (!req.isAdmin) {
    return res.status(401).send({
      status: 401,
      message: 'Bạn không có quyền truy cập chức năng này'
    });
  }
  try {
    const user = await User.findById(req.params.id, { password: 0 });
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

router.delete('/:id', verifyToken, async (req, res) => {
  if (!req.isAdmin) {
    return res.status(401).send({
      status: 401,
      message: 'Bạn không có quyền truy cập chức năng này'
    });
  }
  try {
    const user = await User.findOneAndDelete({ _id: req.params.id });
    if (!user) {
      return res.status(404).send({
        status: 404,
        message: 'User không tồn tại'
      });
    }
    res.status(200).send({
      status: 200,
      message: 'Thao tác thành công'
    });
  } catch (error) {
    return res.status(500).send({
      status: 500,
      message: 'Có lỗi phát sinh trong server'
    });
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  if (!req.isAdmin) {
    return res.status(401).send({
      status: 401,
      message: 'Bạn không có quyền truy cập chức năng này'
    });
  }
  try {
    const user = await User.findOneAndUpdate({ _id: req.params.id }, { $set: req.body }, { sort: { name: 1 }, upsert: true, returnNewDocument: true });
    if (!user) {
      return res.status(404).send({
        status: 404,
        message: 'User không tồn tại'
      });
    }
    res.status(200).send({
      status: 200,
      message: 'Thao tác thành công'
    });
  } catch (error) {
    return res.status(500).send({
      status: 500,
      message: 'Có lỗi phát sinh trong server'
    });
  }
});


// router.delete('/:id', verifyToken, async (req, res) => {
//     try {
//         const user = await User.findAndModify({ query: { _id: req.params.id }, remove: true });
//         if (!user) {
//             return res.status(404).send({
//                 status: 404,
//                 message: 'Không tìm thấy user'
//             });
//         }
//         res.status(200).send({
//             status: 200,
//             message: 'Thao tác thành công'
//         });
//     } catch (error) {
//         return res.status(500).send({
//             status: 500,
//             message: 'Có lỗi phát sinh trong server'
//         });
//     }
// });

// router.put('/:id', verifyToken, async (req, res) => {
//     try {
//         const user = await User.findAndModify({ query: { _id: req.params.id }, sort: { name: 1 }, update: { $set: req.body }, upsert: true, new: true });
//         if (!user) {
//             return res.status(404).send({
//                 status: 404,
//                 message: 'Không tìm thấy user'
//             });
//         }
//         res.status(200).send({
//             status: 200,
//             message: 'Thao tác thành công'
//         });
//     } catch (error) {
//         return res.status(500).send({
//             status: 500,
//             message: 'Có lỗi phát sinh trong server'
//         });
//     }
// });

module.exports = router;