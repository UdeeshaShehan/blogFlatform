const express = require('express');
const router = express.Router();

const { create, list, listAllBlogsCategoriesTags, read, remove, update, photo, listRelated, listSearch, listByUser } = require('../controlers/blog')

const { requireSignin, adminMiddleware, authMiddleware, canUpdateDeleteBlog} = require('../controlers/auth')



router.post('/blog', requireSignin, adminMiddleware, create);
router.get('/blogs', list);
router.post('/blogs-categories-tags', listAllBlogsCategoriesTags);
router.get('/blog/:slug', read);
router.delete('/blog/:slug', requireSignin, adminMiddleware,  remove);
router.put('/blog/:slug', requireSignin, adminMiddleware,  update);
router.get('/blog/photo/:slug', photo);
router.post('/blogs/related', listRelated);
router.get('/blogs/search', listSearch);

//user blog
router.delete('/user/blog/:slug', requireSignin, authMiddleware,  remove);
router.get('/:userName/blogs', listByUser);
router.put('/user/blog/:slug', requireSignin, authMiddleware, canUpdateDeleteBlog, update);
router.post('/user/blog', requireSignin, authMiddleware, canUpdateDeleteBlog, create);

module.exports = router;