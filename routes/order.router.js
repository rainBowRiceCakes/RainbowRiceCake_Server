/**
 * @file routes/order.router.js
 * @description orders 관련 라우터
 * 이 파일은 주문(Order) 관련 API를 관리하는 라우터입니다.
 * 파트너가 주문을 등록하고, 라이더가 주문을 수락/관리하며, 주문 히스토리를 조회하는 기능을 제공합니다.
 * 251223 v1.0.0 BSONG init
 * 251225 v1.1.0 BSONG update - 상태별 주문 목록 및 카운트 조회 기능 추가, 그리고 주문 히스토리 상세 조회 기능 추가
 * 251225 v1.2.0 BSONG update - 라이더 주문 매칭, 픽업 사진, 완료 사진 업로드 기능 추가
 */

import express from 'express';
import authMiddleware from '../app/middlewares/auth/auth.middleware.js';
import orderMiddleware from '../app/middlewares/order/order.middleware.js';
import orderValidator from '../app/middlewares/validations/validators/orders/order.validator.js';
import validationHandler from '../app/middlewares/validations/validationHandler.js';
import multerMiddleware from '../app/middlewares/multer/multer.middleware.js';
import ordersController from '../app/controllers/orders.controller.js';

const { orderDlvUploader } = multerMiddleware;

const orderRouter = express.Router();

// --- 1. ORDER WORKFLOW FOR PARTNERS (파트너와 관련된 당일 내 이뤄지는 주문) ---
// 이 섹션은 파트너가 주문을 등록하고 라이더들이 수락할 수 있도록 하는 워크플로우를 처리합니다.
orderRouter.post('/',
  /* #swagger.tags = ['Orders']
  #swagger.summary = '파트너용 주문 등록'
  #swagger.description = '파트너가 주문을 등록합니다.' */
  authMiddleware,
  orderMiddleware.requirePartnerRole,
  orderValidator.store,
  validationHandler,
  ordersController.store
);

// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------
// --- 2. ORDER WORKFLOW FOR RIDERS (기사와 관련된 당일 내 이뤄지는 주문) ---
// 이 섹션은 라이더가 주문을 매칭하고, 픽업/완료 사진을 업로드하는 워크플로우를 처리합니다.
orderRouter.post('/:orderId',
  /* #swagger.tags = ['Orders']
  #swagger.summary = '라이더용 주문 수락'
  #swagger.description = '라이더가 주문을 수락합니다.' */
  authMiddleware,
  // orderMiddleware.checkOrderExists,
  // orderMiddleware.requireRiderRole,
  orderValidator.match,
  validationHandler,
  ordersController.matchOrder
);

orderRouter.post('/:orderId/pickup-photo',
  /* #swagger.tags = ['Orders']
  #swagger.summary = '라이더용 주문 픽업 사진 업로드'
  #swagger.description = '라이더가 주문 픽업 사진을 업로드합니다.' */
  authMiddleware,                        // 1. 인증 확인
  // orderMiddleware.checkOrderExists,      // 2. 주문 존재 확인
  // orderMiddleware.requireRiderRole,      // 3. 라이더 역할 확인
  orderDlvUploader('pick'),              // 👈 4. 파일 업로드 처리 (여기가 맞음!)
  // orderValidator.uploadPhoto,            // 5. validation
  // validationHandler,                     // 6. validation 결과 처리
  ordersController.uploadPickupPhoto     // 7. 비즈니스 로직
)

orderRouter.post('/:orderId/complete-photo',
  /* #swagger.tags = ['Orders']
  #swagger.summary = '라이더용 주문 완료 사진 업로드'
  #swagger.description = '라이더가 주문 완료 사진을 업로드합니다.' */
  authMiddleware,
  // orderMiddleware.checkOrderExists,
  // orderMiddleware.requireRiderRole,
  orderDlvUploader('com'),               // 👈 여기가 맞음!
  orderValidator.uploadPhoto,
  validationHandler,
  ordersController.uploadCompletePhoto
);

// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------
// --- 3. ORDERS HISTORY FOR PARTNERS and RIDERS ---
// ------------------------------------------ 2026.01.01 추가
orderRouter.get('/',
  /* #swagger.tags = ['Orders']
  #swagger.summary = '라이더와 파트너용 주문 목록 조회'
  #swagger.description = '라이더와 파트너가 주문 목록을 조회합니다.' */
  authMiddleware,
  orderValidator.index,
  validationHandler,
  ordersController.index
);

orderRouter.get('/:orderId',
  /* #swagger.tags = ['Orders']
  #swagger.summary = '라이더와 파트너용 주문 상세 조회'
  #swagger.description = '라이더와 파트너가 주문 상세를 조회합니다.' */
  authMiddleware,
  orderValidator.show,
  validationHandler,
  ordersController.show
);


export default orderRouter;


// orderRouter.get('/today',
//   /* #swagger.tags = ['Orders']
//   #swagger.summary = '라이더와 파트너용 오늘의 주문 리스트 조회'
//   #swagger.description = '라이더와 파트너가 오늘의 주문 리스트를 조회합니다.' */
//   authMiddleware,
//   orderMiddleware.setOrderAccessFilter,
//   orderValidator.todayIndex,
//   validationHandler,
//   ordersController.todayIndex
// );

// orderRouter.get('/deliverystatus',
//   /* #swagger.tags = ['Orders']
//   #swagger.summary = '라이더와 파트너용 배송 현황 조회'
//   #swagger.description = '라이더와 파트너가 배송 현황을 조회합니다.' */
//   ordersController.getDeliveryStatus
// );