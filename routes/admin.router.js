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
import noticesController from '../app/controllers/notices.controller.js';
import showNoticeDetailValidator from '../app/middlewares/validations/validators/notices/show.notice.detail.validator.js';
import sendValidator from '../app/middlewares/validations/validators/notices/send.validator.js';

const adminRouter = express.Router();

// 전체적으로 validation에서 걸리므로(lat, lng처리 없음) 고려하여 만들 것

// *미완성*
// 상세 들어가서 수정(*id값도 함께 받아와야 함)
// -------------어드민 userpage--------------------------
adminRouter.get('/userindex', authMiddleware, adminsController.orderIndex)


// -------------어드민 riderpage--------------------------
adminRouter.put('/rider', authMiddleware, 
  riderCreateValidator, validationHandler, 
  adminsController.riderUpdate)

  // -------------어드민 partnerpage--------------------------
adminRouter.put('/partner', authMiddleware, 
  // partnerStoreValidator, validationHandler , 
  adminsController.partnerUpdate)
adminRouter.post('/partner', authMiddleware, adminsController.partnerCreate)
adminRouter.delete('/partner/:id', authMiddleware, adminsController.partnerDelete)

// -------------어드민 orderpage--------------------------
adminRouter.get('/orderindex', authMiddleware, adminsController.orderIndex)
adminRouter.get('/order/:id', adminsController.show)
adminRouter.post('/order', authMiddleware, orderValidator.store, validationHandler, adminsController.orderCreate)
adminRouter.put('/order', authMiddleware, orderValidator.force, validationHandler, adminsController.orderUpdate)
adminRouter.delete('/order/:id', authMiddleware, adminsController.orderDelete)

// -------------어드민 hotelpage--------------------------
// *adress -> 좌표처리 필요*
adminRouter.post('/hotel', authMiddleware,
  // createValidator, validationHandler , 
  adminsController.hotelUpdate);
  // Hotel 정보 삭제
  adminRouter.delete('/hotel/:id', authMiddleware, adminsController.hotelDelete)

// -------------어드민 noticepage--------------------------
// Notice table에 있는 정보 모두 가져오기
adminRouter.get('/notice',
    authMiddleware,
    noticesController.noticeShow)

// Notice table에 있는 정보 단일로 가져오기
adminRouter.get('/notice/:id',
    authMiddleware,
    showNoticeDetailValidator,
    validationHandler,
    noticesController.noticeShowDetail)

// Notice Detail정보 수정
adminRouter.put('/notice', authMiddleware, sendValidator, validationHandler,
  adminsController.noticeUpdate
)
  
  // Notice 정보 삭제
adminRouter.delete('/notice/:id', authMiddleware, adminsController.noticeDelete)

export default adminRouter;