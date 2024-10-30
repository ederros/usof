const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const multer = require('multer');
const upload = multer({ dest: './public/images' });

router.post('/register', upload.single('avatar'), authController.register);
router.post('/register/:confirmToken', upload.none(), authController.confirmRegister);
router.post('/login', upload.none(), authController.login);
router.post('/logout', upload.none(), authController.logout);
router.post('/password-reset', upload.none(), authController.passwordReset);
router.post('/password-reset/:confirmToken', upload.none(), authController.confirmReset);

module.exports = router;
