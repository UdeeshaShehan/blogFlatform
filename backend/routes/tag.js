const express = require('express');
const router = express.Router();

const { create, list, read, remove} = require('../controlers/tag')
const { requireSignin, authMiddleware, adminMiddleware} = require('../controlers/auth')

const {runValidation} = require('../validators');
const {tagCreateValidator} = require('../validators/tag');

router.post('/tag', tagCreateValidator, runValidation, requireSignin, adminMiddleware, create);
router.get('/tags', list);
router.get('/tag/:slug', read);
router.delete('/tag/:slug', requireSignin, adminMiddleware, remove);

module.exports = router; 