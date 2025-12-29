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
/**
 * Submit order for riders to accept
 * POST /orders
 * 파트너가 주문을 제출하여 라이더들이 수락할 수 있게 합니다.
 */
orderRouter.post('/',
  authMiddleware,                        
  orderMiddleware.requirePartnerRole,    
  orderValidator.store,
  validationHandler,
  ordersController.store                 
);

// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------
// --- 2. ORDER WORKFLOW FOR RIDERS (기사와 관련된 당일 내 이뤄지는 주문) ---
// 이 섹션은 라이더가 주문을 매칭하고, 픽업/완료 사진을 업로드하는 워크플로우를 처리합니다.
/**
 * Accept the order
 * POST /orders/:orderId/match
 * 라이더가 특정 주문을 매칭하여 수락합니다.
 */
orderRouter.post('/:orderId/match',
  authMiddleware,                        
  orderMiddleware.checkOrderExists,      
  orderMiddleware.requireRiderRole,      
  orderValidator.match,
  validationHandler,
  ordersController.matchOrder            
);

/**
 * Drop a pick-up picture
 * POST /orders/:orderId/pickup-photo
 * 라이더가 주문을 픽업할 때 사진을 업로드합니다.
 */
orderRouter.post('/:orderId/pickup-photo',
  authMiddleware,                        // 1. 인증 확인
  orderMiddleware.checkOrderExists,      // 2. 주문 존재 확인
  orderMiddleware.requireRiderRole,      // 3. 라이더 역할 확인
  orderDlvUploader('pick'),              // 👈 4. 파일 업로드 처리 (여기가 맞음!)
  orderValidator.uploadPhoto,            // 5. validation
  validationHandler,                     // 6. validation 결과 처리
  ordersController.uploadPickupPhoto     // 7. 비즈니스 로직
)

/**
 * Drop a complete picture
 * POST /orders/:orderId/complete-photo
 * 라이더가 주문을 완료할 때 사진을 업로드합니다.
 */
orderRouter.post('/:orderId/complete-photo',
  authMiddleware,
  orderMiddleware.checkOrderExists,
  orderMiddleware.requireRiderRole,
  orderDlvUploader('com'),               // 👈 여기가 맞음!
  orderValidator.uploadPhoto,
  validationHandler,
  ordersController.uploadCompletePhoto
);

// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------
// --- 3. ORDER WORKFLOW FOR RIDERS and PARTNERS (라이더와 파트너와 관련된 당일 내 이뤄지는 주문) ---
// 이 섹션은 라이더가 당일 주문을 탭별로 조회하는 워크플로우를 처리합니다. (파트너는 자기 주문만)
/**
 * Get list of rirders for the day by tab (오늘 자 탭별 주문 리스트 조회 - 대기중/진행중/완료)
 * GET /orders/today?tab=waiting&page=1
 * 라이더가 오늘의 주문을 상태별(대기중, 진행중, 완료)로 조회합니다.
 */
orderRouter.get('/today',
  authMiddleware,
  orderMiddleware.setOrderAccessFilter,
  orderValidator.todayIndex,
  validationHandler,
  ordersController.todayIndex
);

// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------
// --- 4. ORDERS HISTORY FOR PARTNERS and RIDERS and ADMIN ---
// 이 섹션은 주문들의 히스토리를 조회하는 기능을 처리합니다.
/**
 * Get list of order history (주문들 LIST 보기)
 * GET /orders
 * 주문들의 목록을 조회합니다.
 */
// orderRouter.get('/',
//   authMiddleware,
//   orderMiddleware.setOrderAccessFilter,  
//   orderValidator.index,
//   validationHandler,
//   ordersController.index
// );
orderRouter.get('/',
  orderValidator.index,
  validationHandler,
  ordersController.index
);


// /**
//  * Get details of order history (주문 내역 DETAIL 보기)
//  * GET /orders/:orderId
//  * 주문의 상세 정보를 조회합니다.
//  */
orderRouter.get('/:orderId',
  authMiddleware,                        
  orderMiddleware.checkOrderExists,      
  orderValidator.show,
  validationHandler,
  ordersController.show                  
);

export default orderRouter;

// -------------------------------------------------------------
// RESTful API 라우팅 규칙:
// GET    /        -> index (목록 조회)
// POST   /        -> store (생성)
// GET    /:id    -> show (상세 조회)
// PUT    /:id    -> update (수정)
// DELETE /:id    -> destroy (삭제)
