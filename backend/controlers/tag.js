const Tag = require('../models/tag');
const Blog = require('../models/blog');
const slugify = require('slugify');

const {errorHandler} = require('../helpers/dbErrorHandler');

exports.create = (req, res) => {
    const { name } = req.body;
    let slug = slugify(name).toLowerCase();

    let tag = new Tag({name, slug});
    tag.save((err, data) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    });

};

exports.list = (req, res) => {
    Tag.find({}).exec((err, data) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    });
};

exports.read = (req, res) => {

    const slug = req.params.slug.toLowerCase();
    Tag.find({slug}).exec((err, data) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        //res.json(data);
        Blog.find({tags: data[0]})
        .populate('categories', '_id name slug')
        .populate('tags', '_id name slug')
        .populate('postedBy', '_id name userName')
        .select('_id title slug excerpt categories tags postedBy createdAt updateAt')
        .exec((error, blogs) => {
            if (error) {
                return res.status(400).json({
                    error: errorHandler(error)
                });
            }
            res.json({tag: data, blogs: blogs});
        });
    });
};

exports.remove = (req, res) => {

    const slug = req.params.slug.toLowerCase();
    Tag.findOneAndRemove({slug}).exec((err, data) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            message:'Tag deleted successfully'
        });
    });
};










