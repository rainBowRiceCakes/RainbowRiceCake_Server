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


const userRouter = express.Router();

userRouter.post('/rider/form', authMiddleware, riderCreateValidator, validationHandler, ridersController.riderFormStore);
userRouter.post('/partner/form', authMiddleware, partnerCreateValidator, validationHandler, partnersController.partnerFormStore);

export default userRouter;