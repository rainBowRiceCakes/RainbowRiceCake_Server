/**
 * @file routes/rider.router.js
 * @description 유저 관련 라우터
 * 251224 v1.0.0 jun 초기 생성
 */

import express from 'express';
import authMiddleware from '../app/middlewares/auth/auth.middleware.js';
import riderFormValidator from '../app/middlewares/validations/validators/riders/rider.form.validator.js';
import partnerFormValidator from '../app/middlewares/validations/validators/partners/partner.form.validator.js';
import validationHandler from '../app/middlewares/validations/validationHandler.js';
import ridersController from '../app/controllers/riders.controller.js';
import partnersController from '../app/controllers/partners.controller.js';


const userRouter = express.Router();

userRouter.post('/rider', authMiddleware, riderFormValidator, validationHandler, ridersController.riderFormStore);
userRouter.post('/partner', authMiddleware, partnerFormValidator, validationHandler, partnersController.partnerFormStore);


export default userRouter;