const shortId = require('shortid');
const User = require('../models/user');
const Blog = require('../models/blog');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const {errorHandler} = require('../helpers/dbErrorHandler');
const _ = require('lodash');
const {OAuth2Client} = require('google-auth-library');

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.preSignup = (req, res) => {
    const {name, email, password} = req.body;
    User.findOne({email: req.body.email}).exec((err, user) => {
        if (user) {
            return res.status(400).json({
                error: 'Email is taken'
            });
        }
        const token = jwt.sign({name, email, password}, process.env.JWT_ACCOUNT_ACTIVATION, {expiresIn:'30m'});
        const emailData = {
            to: email,
            from: process.env.EMAIL_FROM,
            cc:'',
            subject: `Account activation Mail`,
            html:`
                <h4>Please use following link to activate your account</h4>
                <p> ${process.env.CLIENT_URL}/auth/account/activate/${token}</p>
                <hr/>
                <p>This email may contain sensitive information</p>
            `
        }

        sgMail.send(emailData).then(send => {
            return res.json({
                message: `Email has sent to ${email}. Follow the instruction to activate account. Token will be expire in 10 minute`
            });
        });

    });
}

exports.signup = (req, res) => {

    console.log('ddd', req.body)
    const token = req.body.token;
    
    if (token) {
        jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, (err, decoded) => {
            if(err) {
                return res.status(401).json({
                    error:'Link is expire. Sign Up again'
                });
            }

            const {name, email, password} = decoded;
            let userName = shortId.generate();
            let profile = `${process.env.CLIENT_URL}/profile/${userName}`;

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
    } else {
        return res.status(400).json({
            error: 'Something went wrong. Try Again'
        });
    }
}

/*
exports.signup = (req, res) => {
    User.findOne({email: req.body.email}).exec((err, user) => {
        if (user) {
            return res.status(400).json({
                error: 'Email is taken'
            });
        }

        const {name, email, password} = req.body;
        let userName = shortId.generate();
        let profile = `${process.env.CLIENT_URL}/profile/${userName}`;

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
*/

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

        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn:'1d'});

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

exports.canUpdateDeleteBlog = (req, res, next) => {
    const slug = req.params.slug.toLowerCase();
    Blog.findOne({slug})
    .exec((error, data) => {
        if (error) {
            return res.status(400).json({
                error: errorHandler(error)
            });
        }
        let authorizedUser = data.postedBy._id.toString() === req.profile._id.toString();
        if(!authorizedUser) {
            return res.status(400).json({
                error: 'You are not authorized'
            });
        }
        next();
    })
};

exports.forgotPassword = (req, res) => {
    const {email} = req.body;

    User.findOne({email}, (err, user) => {
        if (err || !user) {
            res.json({
                error: 'User with that email does not exist'
            });
        }

        const token = jwt.sign({_id: user._id}, process.env.JWT_RESET_PASSWORD, {expiresIn:'10m'});

        const emailData = {
            to: process.env.EMAIL_FROM,
            from: email,
            cc:'',
            subject: `Password Reset Mail}`,
            html:`
                <h4>Please use following link to change password</h4>
                <p> ${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
                <hr/>
                <p>This email may contain sensitive information</p>
            `
        }
        return user.updateOne({resetPasswordLink:token}, (err, success) => {
            if(err) {
                return res.json({error: errorHandler(err)})
            } else {
                sgMail.send(emailData).then(send => {
                    return res.json({
                        message: `Email has sent to ${email}. Follow the instruction to reset the password. Token will be expire in 10 minute`
                    });
                });
            }
        });
    });
};

exports.resetPassword = (req, res) => {
    const {resetPasswordLink, newPassword} = req.body;
    if(resetPasswordLink) {
        jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, (err, decoded) => {
            if(err) {
                return res.status(401).json({
                    error:'Link is expire. Try again later'
                });
            }
            User.findOne({resetPasswordLink}, (err,user) => {
                if(err || !user) {
                    return res.status(401).json({
                        error:'Something went wrong. Try again'
                    });
                }

                const updateFields = {
                    password: newPassword,
                    resetPasswordLink:''
                }
                user = _.extend(user, updateFields)
                user.save((err, result) => {
                    if(err) {
                        return res.status(400).json({
                            error:errorHandler(err)
                        });
                    }

                    res.json({
                        message:'Now you can login with your new password'
                    })
                });
            });
        });
    }
};

const client= new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleLogin = (req, res) => {
    const idToken = req.body.tokenId;

    client.verifyIdToken({idToken, audience:process.env.GOOGLE_CLIENT_ID}).then(response => {
         // console.log(response)
         const { email_verified, name, email, jti } = response.payload;
         if (email_verified) {
             User.findOne({ email }).exec((err, user) => {
                 if (user) {
                     // console.log(user)
                     const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
                     res.cookie('token', token, { expiresIn: '1d' });
                     const { _id, email, name, role, username } = user;
                     return res.json({ token, user: { _id, email, name, role, username } });
                 } else {
                     let username = shortid.generate();
                     let profile = `${process.env.CLIENT_URL}/profile/${username}`;
                     let password = jti;
                     user = new User({ name, email, profile, username, password });
                     user.save((err, data) => {
                         if (err) {
                             return res.status(400).json({
                                 error: errorHandler(err)
                             });
                         }
                         const token = jwt.sign({ _id: data._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
                         res.cookie('token', token, { expiresIn: '1d' });
                         const { _id, email, name, role, username } = data;
                         return res.json({ token, user: { _id, email, name, role, username } });
                     });
                 }
             });
         } else {
             return res.status(400).json({
                 error: 'Google login failed. Try again.'
             });
         }
    });
}



