const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const auth = require('../middlewares/auth');
const multer = require('multer');
const upload = multer({ dest: './public/images' });

router.get('/', upload.none(), categoryController.getAllCategories);
router.get('/:category_id', upload.none(), categoryController.getCategoryById);
router.get('/:category_id/posts', upload.none(), categoryController.getPostsByCategoryId);
router.post('/', auth, upload.none(), categoryController.createCategory);
router.patch('/:category_id', auth, upload.none(), categoryController.updateCategory);
router.delete('/:category_id', auth, upload.none(), categoryController.deleteCategory);

module.exports = router;
