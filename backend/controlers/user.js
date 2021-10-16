const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');

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
    User.findOne({userName}).exec((err, userFromDB) => {
        if (err || !userFromDB) {
            return res.status(400).json({
                error: 'User not found'
            });
        }

        user = userFromDB;
        let userId = user._id;
        Blog.find({postedBy: userId})
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
            user.hash_password = undefined;
            user.salt = undefined;
            console.log({
                user, blogs: data
            });
            res.json({
                user, blogs: data
            })
        })

    });
};

exports.update= (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtension = true;
    form.parse(req, (err, fields, files) => {
        console.log(err);
        if (err) {
            return res.status(400).json({
                error: err
            });
        }
        console.log('fff',fields)

        let user = req.profile;
        user = _.extend(user, fields);

        if(fields.password && fields.password.length < 6) {
            return res.status(400).json({
                error:'Password length should be greater than or equals to 6'
            });
        }

        if(files.photo) {
            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error:'Image size should be less than 1mb'
                });
            }

            user.photo.data = fs.readFileSync(files.photo.path);
            user.photo.contentType = files.photo.type;

        }

        user.save((error, result) => {
            if (error) {
                return res.status(400).json({
                    error:errorHandler(error)
                });
            }
            user.salt = undefined;
            user.hash_password = undefined;
            user.photo = undefined;
            res.json(user);
        });
    })
}

exports.photo = (req, res) => {
    const userName = req.params.username;
    User.findOne({userName})
    .exec((error, data) => {
        if (error || !data) {
            return res.status(400).json({
                error: errorHandler(error)
            });
        }
        res.set('Content-Type', data.photo.contentType);
        return res.send(data.photo.data)
    })

}