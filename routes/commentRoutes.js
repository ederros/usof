const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const auth = require('../middlewares/auth');
const multer = require('multer');
const upload = multer({ dest: './public/images' });

router.get('/:id',upload.none(), commentController.getCommentById);
router.get('/:id/like', upload.none(),commentController.getLikeByCommentId);
router.post('/:id/like', upload.none(),auth, commentController.createLikeByCommentId); 
router.patch('/:id', auth, upload.none(),commentController.updateComment);
router.delete('/:id', auth, upload.none(),commentController.deleteComment);
router.delete('/:id/like', auth, upload.none(),commentController.removeLike);

module.exports = router;
