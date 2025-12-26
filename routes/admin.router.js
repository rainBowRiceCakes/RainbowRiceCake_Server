/**
 * @file routes/admin.router.js
 * @description 어드민 관련 라우터
 * 251223 v1.0.0 wook init
 */

import express from 'express';
import authMiddleware from '../app/middlewares/auth/auth.middleware.js';
import adminsController from '../app/controllers/admins.controller.js';
import riderCreateValidator from '../app/middlewares/validations/validators/riders/rider.create.validator.js';
import validationHandler from '../app/middlewares/validations/validationHandler.js';
import partnerCreateValidator from '../app/middlewares/validations/validators/partners/partner.create.validator.js';
import createValidator from '../app/middlewares/validations/validators/hotels/create.validator.js';

const adminRouter = express.Router();

// 전체적으로 validation에서 걸리므로(lat, lng처리 없음) 고려하여 만들 것

// *미완성*
// 상세 들어가서 수정(*id값도 함께 받아와야 함)
// adminRouter.post('/rider', authMiddleware, riderCreateValidator, validationHandler , adminsController.riderUpdate)
// adminRouter.post('/partner', authMiddleware, partnerCreateValidator, validationHandler , adminsController.partnerUpdate)
adminRouter.post('/rider', adminsController.riderUpdate)
adminRouter.post('/partner', adminsController.partnerUpdate)

// *완성*
adminRouter.post('/hotel', authMiddleware, createValidator, validationHandler , adminsController.hotelUpdate)

export default adminRouter;