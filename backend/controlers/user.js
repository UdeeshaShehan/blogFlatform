const User = require('../models/user');
const Blog = require('../models/blog');

const {errorHandler} = require('../helpers/dbErrorHandler');

exports.read = (req, res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile);
};

exports.publicProfile = (req, res) => {
    let userName = req.params.username;
    let user;
    let blogs;
    User.findOne({userName}).exec((err, userFromDB) => {
        if (err || !userFromDB) {
            return res.status(400).json({
                error: 'User not found'
            });
        }

        user = userFromDB;
        let userId = user._id;
        Blog.findOne({postedBy: userId})
        .populate('categories', '_id name slug')
        .populate('tags', '_id name slug')
        .populate('postedBy', '_id name')
        .select('_id title slug excerpt categories tags postedBy createdAt updateAt')
        .limit(10)
        .exec((error, data) => {
            if (error) {
                return res.status(400).json({
                    error: errorHandler(error)
                });
            }
            user.photo = undefined;
            res.json({
                user, blogs: data
            })
        })

    });
};