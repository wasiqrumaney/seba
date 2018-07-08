"use strict";

const express        = require('express');
const router         = express.Router();

const middlewares    = require('../middlewares');
const AuthController = require('../controllers/auth');

const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/login', AuthController.login);
router.post('/register', upload.single('image'), AuthController.register);
router.get('/me', middlewares.checkAuthentication , AuthController.me);

module.exports = router;