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
    const userId = req.user.id; // "현재 로그인한 유저의 ID"임을 명시
    const orderData = req.body;

    // 서비스에게 "이 유저가 주문하려는데, 이 유저에 해당하는 파트너 찾아서 주문해줘"라고 요청
    const result = await OrdersService.createNewOrder({ userId, orderData });

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, result));
  } catch (error) {
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
    console.log('🔥 matchOrder:', req.params.orderId, req.user.id);


    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, result));
  } catch (error) {
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
  console.log('파일 확인:', req.file);
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
  } catch (error) {
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

// ------------------------------------------ 2026.01.01 추가
/**
 * Get list of order history (주문 히스토리 LIST 조회)
 * @param {import("express").Request} req - Request 객체
 * @param {import("express").Response} res - Response 객체
 * @param {import("express").NextFunction} next - NextFuction 객체
 * @returns
*/
async function index(req, res, next) {
  try {
    const { id: userId, role } = req.user;

    const { status, date, page, limit, riderId } = req.query;

    const result = await OrdersService.getOrdersList({
      userId,
      role,
      email: req.user.email,
      date,
      status,
      page,
      limit,
      riderId,
    });

    return res
      .status(SUCCESS.status)
      .send(createBaseResponse(SUCCESS, result));
  } catch (error) {
    return next(error);
  }
}

export const getHourlyStats = async (req, res) => {
  try {
    // req.user가 있는지 먼저 체크
    if (!req || !req.user) {
      return res.status(401).json({
        code: "E01",
        msg: "인증 정보가 없습니다. 다시 로그인해주세요."
      });
    }

    const { userId, role } = req.user;
    const stats = await ordersService.getHourlyOrderStats({ userId, role });

    res.status(200).json(stats);
  } catch (error) {
    console.error('[getHourlyStats Error]:', error);
    res.status(500).json({ code: "E99", msg: "서버 오류가 발생했습니다." });
  }
};

export default {
  store,
  matchOrder,
  uploadPickupPhoto,
  uploadCompletePhoto,
  show,
  index,
  getHourlyStats
};

// RESTful API Controller Method Naming Conventions
// index : 데이터 조회 처리 (리스트 페이지 or 리스트 데이터 획득)
// show : 상세 데이터 조회 (상세 페이지 or 상세 데이터 획득)
// create : 새로운 데이터 작성하고 저장하기 위한 페이지 출력
// store : 새로운 데이터 작성 처리
// edit : 수정 페이지 출력
// update : 데이터 수정 처리
// destroy : 데이터 삭제