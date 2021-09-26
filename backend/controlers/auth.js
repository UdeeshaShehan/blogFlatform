const shortId = require('shortid');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

exports.signup = (req, res) => {
    User.findOne({email: req.body.email}).exec((err, user) => {
        if (user) {
            return res.status(400).json({
                error: 'Email is taken'
            });
        }

        const {name, email, password} = req.body;
        let userName = shortId.generate();
        let profile = `${process.env.CLIENT_URL}/profile/userName`;

        let newUser = new User({userName, name, email, password, profile});
        newUser.save((error, success) => {
            if (error) {
                return res.status(400).json({
                    error: error
                });
            }
            res.json({
                message: 'Signup success! Please Sign in'
            });
        });
    });
};


exports.signin = (req, res) => {
    const {email, password} = req.body;
    User.findOne({email}).exec((error, user) => {
        if(error || !user) {
            return res.status(400).json({
                error: 'User with this email address does not exist. Please Sign Up'
            });
        }

        if(!user.authenticate(password)) {
            return res.status(400).json({
                error: 'Email and Password do not match'
            });
        }

        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn:'1d'})

        res.cookie('token', token, {expiresIn:'1d'});

        const {_id, userName, name, email, role} = user;

        return res.json({
            token, user: {_id, userName, name, email, role}
        });
    });

};

exports.signout = (req, res) => {
    res.clearCookie();
    res.json({
        message: 'sign out successful'
    });
};

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET
    , algorithms: ['HS256']
});

exports.authMiddleware = (req, res, next) => {
    const authUserId = req.user._id;
    User.findById({_id: authUserId}).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error:'User not found'
            });
        }
        req.profile = user;
        next();
    });
};

exports.adminMiddleware = (req, res, next) => {
    const adminUserId = req.user._id;
    User.findById({_id: adminUserId}).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error:'User not found'
            });
        }

        if(user.role !== 1) {
            return res.status(400).json({
                error:'Admin resource not found. Access Denied'
            });
        }

        req.profile = user;
        next();
    });
};