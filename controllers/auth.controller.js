const User = require('../models/user.model');
const md5 = require('md5')

module.exports.login = (req, res) => {
  res.render('auth/login');
};

module.exports.postLogin = async (req, res) => {
    const user = await User.findOne({user_name: req.body.email});

    if(!user) {
        res.render('auth/login', {
            errors: ['User do not exist.'],
            values: req.body
        });
        return;
    }

    const hashPassWord = md5(req.body.password);

    if(user.pass_word !== hashPassWord) {
        res.render('auth/login', {
            errors: ['Wrong password.'],
            values: req.body
        });
        return;
    }

    res.cookie('user_id', user._id, {
        signed: true
    });
    res.redirect('/customers');
};

module.exports.signup = (req, res) => {
    res.render('auth/signup');
};

module.exports.postSignUp = async (req, res) => {
    const user = await User.findOne({user_name: req.body.email});

    if(user) {
        res.render('auth/signup', {
            errors: ['User exist.'],
            values: req.body
        });
        return;
    }

    const hashPassWord = md5(req.body.password);
    const user_new = {
        user_name: req.body.email,
        pass_word: hashPassWord,
        name: req.body.name
    }
    User.insertMany([user_new]);
    res.redirect('/auth/login');
};

module.exports.postLogout = (req, res) => {
    res.clearCookie('user_id');
    res.redirect('/');
}