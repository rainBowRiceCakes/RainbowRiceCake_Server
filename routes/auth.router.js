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

authRouter.post('/login',
  /* #swagger.tags = ['Auth']
  #swagger.summary = '로그인'
  #swagger.description = '인증된 사용자가 로그인합니다.' */
  loginValidator,
  validationHandler,
  authController.adminLogin)

authRouter.post('/logout',
  /* #swagger.tags = ['Auth']
  #swagger.summary = '로그아웃'
  #swagger.description = '인증된 사용자가 로그아웃합니다.' */
  authMiddleware,
  authController.adminLogout)

authRouter.post('/social/login',
  /* #swagger.tags = ['Auth']
  #swagger.summary = '소셜 로그인'
  #swagger.description = '인증된 사용자가 소셜 로그인합니다.' */
  loginValidator,
  validationHandler,
  authController.login)

authRouter.post('/user/logout',
  /* #swagger.tags = ['Auth']
  #swagger.summary = '소셜 로그인'
  #swagger.description = '인증된 사용자가 소셜 로그인합니다.' */
  authMiddleware,
  authController.logout)

authRouter.post('/reissue',
  /* #swagger.tags = ['Auth']
  #swagger.summary = '재발급'
  #swagger.description = '인증된 사용자가 재발급합니다.' */
  authController.reissue)

authRouter.post('/admreissue',
  /* #swagger.tags = ['Auth']
  #swagger.summary = '재발급'
  #swagger.description = '인증된 사용자가 재발급합니다.' */
  authController.adminReissue)

authRouter.get('/social/kakao',
  /* #swagger.tags = ['Auth']
  #swagger.summary = '소셜 로그인'
  #swagger.description = '인증된 사용자가 소셜 로그인합니다.' */
  validationHandler,
  authController.social)

authRouter.get('/callback/kakao',
  /* #swagger.tags = ['Auth']
  #swagger.summary = '소셜 로그인'
  #swagger.description = '인증된 사용자가 소셜 로그인합니다.' */
  authController.socialCallback)

export default authRouter;