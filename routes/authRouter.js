const express = require('express');
const authController = require('../controller/authController');

const authRouter = express.Router();

authRouter.get('/signup', authController.getSignup);
authRouter.get('/login', authController.getLogin);
authRouter.post('/signup',authController.postSignup);
authRouter.post('/login',authController.postLogin);
authRouter.get('/logout',authController.getLogout);


module.exports = authRouter;