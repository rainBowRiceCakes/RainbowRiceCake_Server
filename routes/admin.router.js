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
import partnerStoreValidator from '../app/middlewares/validations/validators/partners/partner.store.validator.js';
import orderValidator from '../app/middlewares/validations/validators/orders/order.validator.js';

const adminRouter = express.Router();

// 전체적으로 validation에서 걸리므로(lat, lng처리 없음) 고려하여 만들 것

// *미완성*
// 상세 들어가서 수정(*id값도 함께 받아와야 함)
// -------------어드민 userpage--------------------------
adminRouter.get('/userindex', authMiddleware, adminsController.orderIndex)


// -------------어드민 riderpage--------------------------
adminRouter.post('/rider', authMiddleware, 
  // riderCreateValidator, validationHandler , 
  adminsController.riderUpdate)

  // -------------어드민 partnerpage--------------------------
adminRouter.put('/partner', authMiddleware, 
  // partnerStoreValidator, validationHandler , 
  adminsController.partnerUpdate)
adminRouter.post('/partner', authMiddleware, adminsController.partnerCreate)

// -------------어드민 orderpage--------------------------
adminRouter.get('/orderindex', authMiddleware, adminsController.orderIndex)
adminRouter.get('/order/:id', adminsController.show)
adminRouter.post('/order', authMiddleware, orderValidator.store, validationHandler, adminsController.orderCreate)
adminRouter.put('/order', authMiddleware, orderValidator.force, validationHandler, adminsController.orderUpdate)

// *adress -> 좌표처리 필요*
adminRouter.post('/hotel', authMiddleware,
  // createValidator, validationHandler , 
  adminsController.hotelUpdate);

export default adminRouter;