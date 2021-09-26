const Category = require('../models/category');
const Blog = require('../models/blog');
const slugify = require('slugify');

const {errorHandler} = require('../helpers/dbErrorHandler');

exports.create = (req, res) => {
    const { name } = req.body;
    let slug = slugify(name).toLowerCase();

    let category = new Category({name, slug});
    category.save((err, data) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    });

};

exports.list = (req, res) => {
    Category.find({}).exec((err, data) => {
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
    Category.find({slug}).exec((err, data) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        //res.json(data);
        Blog.find({categories: data[0]})
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
            res.json({category: data, blogs: blogs});
        });
    });
};

exports.remove = (req, res) => {

    const slug = req.params.slug.toLowerCase();
    Category.findOneAndRemove({slug}).exec((err, data) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            message:'Category deleted successfully'
        });
    });
};










