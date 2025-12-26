/**
 * @file routes/auth.router.js
 * @description 인증 관련 라우터
 * 251218 v1.0.0 wook init
 * 251222 v2.0.0 jun auth 라우터 추가
 */

import express from 'express';
import authController from '../app/controllers/auth.controller.js';
import validationHandler from '../app/middlewares/validations/validationHandler.js';
import loginValidator from '../app/middlewares/validations/validators/auth/login.validator.js';
import authMiddleware from '../app/middlewares/auth/auth.middleware.js';


const authRouter = express.Router();

authRouter.post('/login', loginValidator, validationHandler, authController.adminLogin);
authRouter.post('/logout', authMiddleware, authController.adminLogout);
authRouter.post('/social/login', loginValidator, validationHandler, authController.login);
authRouter.post('/reissue', authController.reissue);
authRouter.get('/social/kakao', validationHandler, authController.social);
authRouter.get('/callback/kakao', authController.socialCallback);

export default authRouter;