/**
 * @file routes/rider.router.js
 * @description 유저 관련 라우터
 * 251224 v1.0.0 jun 초기 생성
 */

import express from 'express';
import authMiddleware from '../app/middlewares/auth/auth.middleware.js';
import validationHandler from '../app/middlewares/validations/validationHandler.js';
import riderCreateValidator from '../app/middlewares/validations/validators/riders/rider.create.validator.js';
import ridersController from '../app/controllers/riders.controller.js';
import partnerCreateValidator from '../app/middlewares/validations/validators/partners/partner.create.validator.js';
import partnersController from '../app/controllers/partners.controller.js';
import usersController from '../app/controllers/users.controller.js';


const userRouter = express.Router();

userRouter.post('/rider/form', authMiddleware, riderCreateValidator, validationHandler, ridersController.riderFormStore);
userRouter.post('/partner/form', authMiddleware, partnerCreateValidator, validationHandler, partnersController.partnerFormStore);

// -----------------아래 유저 페이지 사용----------------------
userRouter.get('/location', authMiddleware,usersController.searchPartners) // 권한 없이 제휴 업체 정보 조회
userRouter.get('/orders/history', authMiddleware, usersController.getMyPageSummary) // 로그인한 유저의 주문 히스토리 요약 정보 조회


// ----------------아래 어드민 페이지 사용----------------------
userRouter.get('/show', authMiddleware, usersController.showIndex)
userRouter.get('/show/:id', authMiddleware, usersController.showDetail)
userRouter.put('/update', authMiddleware, usersController.userUpdate)
userRouter.post('/store', authMiddleware, usersController.store)

export default userRouter;