const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const jwt = require('jsonwebtoken');
const auth = require('../middlewares/auth');
const multer = require('multer');
const upload = multer({ dest: './public/images' });


router.get('/', upload.none(), postController.getAllPosts);
router.get('/:id', upload.none(), postController.getPostById);
router.get('/:id/comments',upload.none(), postController.getCommentsByPostId);
router.get('/:id/categories', upload.none(), postController.getCategoriesByPostId);
router.get('/:id/likes',upload.none(), postController.getLikesByPostId);

router.post('/', auth, upload.none(), postController.createPost);
router.post('/:id/comments', auth,upload.none(), postController.createComment);
router.post('/:id/like', auth, upload.none(), postController.likePost);

router.patch('/:id', auth, upload.none(), postController.updatePost);
router.delete('/:id', auth, upload.none(), postController.deletePost);
router.delete('/:id/like', auth, upload.none(), postController.removeLike);

module.exports = router;
