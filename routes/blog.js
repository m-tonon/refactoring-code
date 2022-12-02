const express = require('express');

const blogController = require('../controllers/post-controller');
const guardRoute = require('../middlewares/auth-protection-middleware');

const router = express.Router();

router.get('/', blogController.getHome);

router.use(guardRoute); // all the next lines will be protected by this middleware
// its the same effect than add guardRoute for each router 
// (e.g ('/admin'), guardRoute, blogController...)

router.get('/admin', blogController.getAdm);

router.post('/posts', blogController.createPost);

router.get('/posts/:id/edit', blogController.getSinglePost);

router.post('/posts/:id/edit', blogController.updatePost);

router.post('/posts/:id/delete', blogController.deletePost);

module.exports = router;
