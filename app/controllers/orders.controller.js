/**
 * @file app/controllers/orders.controller.js
 * @description order 관련 컨트롤러 (주문 등록, 오늘 자 탭별 주문 리스트 조회, 주문 히스토리 리스트 및 상세 조회)
 * 251223 v1.0.0 BSONG init
 * 251225 v1.1.0 BSONG update - 상태별 주문 목록 및 카운트 조회 기능 추가, 그리고 주문 히스토리 상세 조회 기능 추가
*/

import { SUCCESS } from '../../configs/responseCode.config.js';
import OrdersService from '../services/orders.service.js';
import { createBaseResponse } from '../utils/createBaseResponse.util.js';
import myError from '../errors/customs/my.error.js';
import { BAD_REQUEST_ERROR } from '../../configs/responseCode.config.js';
import ordersService from '../services/orders.service.js';

// --- 1. ORDER WORKFLOW FOR PARNERS (파트너와 관련된 당일 내 이뤄지는 주문) ---
/**
 * Save a new order for riders to accept (주문 등록)
 * @param {import("express").Request} req - Request 객체
 * @param {import("express").Response} res - Response 객체
 * @param {import("express").NextFunction} next - NextFuction 객체
 * @returns
 */
async function store(req, res, next) {
  try {
    const createData = {
      ...req.body,
      partnerId: req.user.id
    }
    
    const result = await OrdersService.createNewOrder(createData);
    
    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, result));
  } catch(error) {
    return next(error);
  }
}

// --- 2. ORDER WORKFLOW FOR RIDERS (라이더와 관련된 당일 내 이뤄지는 주문) ---
/**
 * Match an order (라이더 - 주문 매칭)
 * @param {import("express").Request} req - Request 객체
 * @param {import("express").Response} res - Response 객체
 * @param {import("express").NextFunction} next - NextFuction 객체
 * @returns
*/
async function matchOrder(req, res, next) {
  try {
    const orderId = req.params.orderId;
    const riderId = req.user.id;
    
    const result = await OrdersService.matchOrder({ orderId, riderId });
    
    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, result));
  } catch(error) {
    return next(error);
  }
}

/**
 * Upload a pickup photo (라이더 - 픽업 사진 업로드)
 * 미들웨어에서 주문 존재, 권한 체크, 파일 업로드 완료
 * @param {import("express").Request} req - Request 객체
 * @param {import("express").Response} res - Response 객체
 * @param {import("express").NextFunction} next - NextFuction 객체
 * @returns
 */
async function uploadPickupPhoto(req, res, next) {
  try {
    if (!req.file) {
      throw myError('사진 파일이 필요합니다.', BAD_REQUEST_ERROR);
    }

    const orderId = req.params.orderId;
    const riderId = req.user.id;
    const photoPath = req.file.filename;

    const result = await OrdersService.uploadPickupPhoto({ 
      orderId,
      riderId,
      photoPath 
    });

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, result));
  } catch(error) {
    return next(error);
  }
}

/**
 * Upload a complete photo (라이더 - 완료 사진 업로드)
 * @param {import("express").Request} req - Request 객체
 * @param {import("express").Response} res - Response 객체
 * @param {import("express").NextFunction} next - NextFuction 객체
 * @returns
 */
async function uploadCompletePhoto(req, res, next) {
  try {
    if (!req.file) {
      throw myError('사진 파일이 필요합니다.', BAD_REQUEST_ERROR);
    }

    const orderId = req.params.orderId;
    const riderId = req.user.id;
    const photoPath = req.file.filename;

    const result = await OrdersService.uploadCompletePhoto({ 
      orderId,
      riderId,
      photoPath 
    });

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, result));
  } catch(error) {
    return next(error);
  }
}

// --- 3. ORDER WORKFLOW FOR RIDERS & PARTNERS & ADMIN (기사/점주/어드민) ---
/**
 * Get orders for the day by Tab (오늘 자 탭별 주문 리스트 조회 - 대기중/진행중/완료)
 * @param {import("express").Request} req - Request 객체
 * @param {import("express").Response} res - Response 객체
 * @param {import("express").NextFunction} next - NextFuction 객체
 * @returns
 */
async function todayIndex(req, res, next) {
  try {
    const filter = req.orderFilter;
    const tab = req.query.tab || 'waiting';
    const page = parseInt(req.query.page) || 1;

    const result = await OrdersService.getTodayOrders({
      filter,
      tab,
      page
    });

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, result));
  } catch (error) {
    return next(error);
  }
}

/**
 * Get list of order history (주문 히스토리 LIST 조회)
 * @param {import("express").Request} req - Request 객체
 * @param {import("express").Response} res - Response 객체
 * @param {import("express").NextFunction} next - NextFuction 객체
 * @returns
*/
async function index(req, res, next) {
  try {
    const filter = req.orderFilter;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const status = req.query.status;
    const from = req.query.from;
    const to = req.query.to;

    const result = await OrdersService.getOrdersList({
      filter,
      status,
      from,
      to,
      page,
      limit,
    });

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, result));
  } catch (error) {
    return next(error);
  }
}


/**
 * Get details of order history (주문 히스토리 DETAIL 조회)
 * @param {import("express").Request} req - Request 객체
 * @param {import("express").Response} res - Response 객체
 * @param {import("express").NextFunction} next - NextFuction 객체
 * @returns
 */
async function show(req, res, next) {
  try {
    const orderId = req.params.orderId;
    const userId = req.user.id;
    const userRole = req.user.role;

    const result = await OrdersService.getOrderDetail({ 
      orderId, 
      userId, 
      userRole 
    });

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, result));
  } catch (error) {
    return next(error);
  }
}

/**
 * 배송 현황 조회 (주문 PK로만 조회)
 * GET /api/orders/deliverystatus?dlvId=4
 */
const getDeliveryStatus = async (req, res, next) => {
  try {
    // URL 파라미터에서 dlvId 추출
    const { dlvId } = req.body; 

    const result = await ordersService.getDeliveryStatus({ 
      dlvId: parseInt(dlvId) 
    });

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, result));
  } catch (error) {
    return next(error);
  }
};

export default {
  store,
  matchOrder,
  uploadPickupPhoto,
  uploadCompletePhoto,
  todayIndex,
  index,
  show,
  getDeliveryStatus
};

// RESTful API Controller Method Naming Conventions
// index : 데이터 조회 처리 (리스트 페이지 or 리스트 데이터 획득)
// show : 상세 데이터 조회 (상세 페이지 or 상세 데이터 획득)
// create : 새로운 데이터 작성하고 저장하기 위한 페이지 출력
// store : 새로운 데이터 작성 처리
// edit : 수정 페이지 출력
// update : 데이터 수정 처리
// destroy : 데이터 삭제