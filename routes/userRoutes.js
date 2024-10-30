const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const multer = require('multer');
const upload = multer({ dest: './public/images' });
const auth = require('../middlewares/auth');

router.get('/', upload.none(), userController.getAllUsers);
router.get('/:id', upload.none(), userController.getUserById);
router.post('/', auth, upload.none(), userController.createUser); 
router.patch('/:id', auth, upload.none(), userController.updateUser);
router.patch('/:id/avatar', auth, upload.single('avatar'), userController.uploadAvatar);
router.delete('/:id', auth, upload.none(), userController.deleteUser);

module.exports = router;
