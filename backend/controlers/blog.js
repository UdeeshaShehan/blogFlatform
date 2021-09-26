const formidable = require('formidable');
const slugify = require('slugify');
const {stripHtml} = require('string-strip-html');
const _ = require('lodash');
const fs = require('fs');

const Blog = require('../models/blog');
const Category = require('../models/category');
const Tag = require('../models/tag');

const {errorHandler} = require('../helpers/dbErrorHandler');
const {smartTrim} = require('../helpers/blog');

exports.create = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error:'Image is not uploaded'
            });
        }
        const {title, body, categories, tags} = fields;

        if (!title || !title.length) {
            return res.status(400).json({
                error:'Title is required'
            });
        }

        if (!body || body.length < 200) {
            return res.status(400).json({
                error:'Content is too short'
            });
        }

        if (!categories || categories.length == 0) {
            return res.status(400).json({
                error:'At least one category is required'
            });
        }

        if (!tags || tags.length == 0) {
            return res.status(400).json({
                error:'At least one tag is required'
            });
        }

        let blog = new Blog();
        blog.title = title;
        blog.body = body;
        blog.slug = slugify(title).toLowerCase();
        blog.mtitle = `${title} - ${process.env.APP_NAME}`;
        blog.mdesc = stripHtml(body.substring(0, 160)).result;
        blog.postedBy = req.user._id;
        blog.excerpt = smartTrim(body, 320, ' ', '...');

        let arrayOfCategories = categories && categories.split(',');
        let arrayOfTags = tags && tags.split(',');
        
        if (files.photo) {
            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error:'Image should be less than 1MB in size'
                });
            };
            blog.photo.data = fs.readFileSync(files.photo.path)
            blog.photo.contentType = files.photo.type;
        }

        blog.save((err, result) => {
            if(err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }

            Blog.findByIdAndUpdate(result._id, {$push: {categories:arrayOfCategories}}, {new: true}).exec((err, result) => {
                if(err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    });
                }

                Blog.findByIdAndUpdate(result._id, {$push: {tags:arrayOfTags}}, {new: true}).exec((err, result) => {
                    if(err) {
                        return res.status(400).json({
                            error: errorHandler(err)
                        });
                    }

                    res.json(result);
                });
            });

            //res.json(result);
        });
    });
};

// list, listAllBlogsCategoriesTags, read, remove, update 

exports.list = (req, res) => {
    Blog.find({})
    .populate('categories', '_id name slug')
    .populate('tags', '_id name slug')
    .populate('postedBy', '_id name userName')
    .select('_id title excerpt slug categories tags postedBy createdATt updateAt')
    .exec((error, data) => {
        if (error) {
            return res.status(400).json({
                error: errorHandler(error)
            });
        }
        res.json(data);
    })
}

exports.listAllBlogsCategoriesTags = (req, res) => {
    let limit = req.body.limit ? parseInt(req.body.limit) : 10;
    let skip = req.body.skip ? parseInt(req.body.skip): 0;
    let blogs;
    let categories;
    let tags;

    Blog.find({})
    .populate('categories', '_id name slug')
    .populate('tags', '_id name slug')
    .populate('postedBy', '_id name userName profile')
    .select('_id title excerpt slug categories tags postedBy createdAt updatedAt')
    .sort({createdAt: -1})
    .skip(skip)
    .limit(limit)
    .exec((error, data) => {
        if (error) {
            return res.status(400).json({
                error: errorHandler(error)
            });
        }
        blogs = data;
        Category.find({}).exec((error, data) => {
            if (error) {
                return res.status(400).json({
                    error: errorHandler(error)
                });
            }
            categories = data;
            Tag.find({}).exec((error, data) => {
                if (error) {
                    return res.status(400).json({
                        error: errorHandler(error)
                    });
                }
                tags = data;
                res.json({blogs, categories, tags, size: blogs.length})
            })
        })
    })
}

exports.read = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    Blog.findOne({slug})
    .populate('categories', '_id name slug')
    .populate('tags', '_id name slug')
    .populate('postedBy', '_id name userName')
    .select('_id title body slug mtitle mdesc categories tags postedBy createdAt updateAt')
    .exec((error, data) => {
        if (error) {
            return res.status(400).json({
                error: errorHandler(error)
            });
        }
        res.json(data)
    })

}

exports.photo = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    Blog.findOne({slug})
    .select('photo')
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


exports.remove = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    Blog.findOneAndRemove({slug}).exec((error, data) => {
        if (error) {
            return res.status(400).json({
                error: errorHandler(error)
            });
        }
        res.json({
            message: 'Blog deleted successfully'
        })
    })
}

exports.update = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    Blog.findOne({slug}).exec((err, oldBlog) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(error)
            });
        }

        let form = new formidable.IncomingForm();
        form.keepExtensions = true;
        form.parse(req, (err, fields, files) => {
            if (err) {
                return res.status(400).json({
                    error:'Image is not uploaded'
                });
            }

            let slugBeforeMerge = oldBlog.slug;
            oldBlog = _.merge(oldBlog, fields);
            oldBlog.slug  = slugBeforeMerge;

            const {body, desc, categories, tags} = fields;

            if (body) {
                oldBlog.excerpt = smartTrim(body, 320, ' ', ' ...')
                oldBlog.mdesc = stripHtml(body.substring(0, 160)).result;
            }

            if (categories) {
                oldBlog.categories = categories.split(',')
            }

            if (tags) {
                oldBlog.tags = tags.split(',')
            }
            
            if (files.photo) {
                if (files.photo.size > 1000000) {
                    return res.status(400).json({
                        error:'Image should be less than 1MB in size'
                    });
                };
                oldBlog.photo.data = fs.readFileSync(files.photo.path)
                oldBlog.photo.contentType = files.photo.type;
            }

            oldBlog.save((err, result) => {
                if(err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    });
                }
                res.json(result);
            });
        });

    });

};

exports.listRelated = (req, res) => {
    let limit = req.body.limit ? parseInt(req.body.limit) : 3;

    const {_id, categories} =  req.body.blog;
    Blog.find({_id:{$ne:_id}, categories:{$in:categories}})
    .limit(limit)
    .populate('postedBy' , '_id name profile' )
    .select('title slug excerpt postedBy createdAt updatedAt')
    .exec((err, blogs) => {
        if(err) {
            return res.status(400).json({
                error: 'Relate blog is not found'
            });
        }
        res.json(blogs);
    });
}


exports.listSearch = (req, res) => {
    const {search} = req.query;
    if (search) {
        Blog.find({
            $or: [{title: {$regex:search, $options:'i'}}, {body:{$regex:search, $options:'i'}}]
        }, (error, data) => {
            if (error) {
                return res.status(400).json({
                    error: errorHandler(error)
                });
            }
            res.json(data);
        }).select('-photo -body');
    }
}