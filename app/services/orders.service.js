/**
 * @file app/serivces/orders.service.js
 * @description orders Service (주문 등록, 오늘 자 탭별 주문 리스트 조회, 주문 히스토리 리스트 및 상세 조회)
 * 251225 BSONG init
 * 251225 v1.1.0 BSONG update - 상태별 주문 목록 및 카운트 조회 기능 추가, 그리고 주문 히스토리 상세 조회 기능 추가
*/

import orderRepository from "../repositories/order.repository.js";
import riderRepository from "../repositories/rider.repository.js";
import imageRepository from "../repositories/image.repository.js";
import myError from "../errors/customs/my.error.js";
import { NOT_FOUND_ERROR } from "../../configs/responseCode.config.js";
import { Op } from 'sequelize'; // Sequelize Operators
import dayjs from 'dayjs'; // Import dayjs

// --- 1. ORDER WORKFLOW FOR PARNERS (파트너와 관련된 당일 내 이뤄지는 주문) ---
/**
 * Create a new order (주문 등록 - partner 가 생성)
 * @param {*} data 
 * @returns 
*/
async function createNewOrder(data) {
  return await orderRepository.create(null, data)
}

// --- 2. ORDER WORKFLOW FOR RIDERS (라이더와 관련된 당일 내 이뤄지는 주문) ---
/**
 * Match Rider to Order (주문 매칭 - rider 가 수락)
 * @param {object} data
 * @param {number} data.orderId
 * @param {number} data.riderId
 * @returns {Promise<any>}
 */
async function matchOrder({ orderId, riderId }) {
  // 라이더 존재 확인
  const rider = await riderRepository.findByPk(null, riderId);
  if (!rider) {
    throw myError('라이더 정보를 찾을 수 없습니다.', NOT_FOUND_ERROR);
  }

  // 주문 업데이트
  const [updatedCount] = await orderRepository.update(null, orderId, {
    rider_id: riderId,
    status: 'match',
  });

  return updatedCount;
}

/**
 * Upload pickup photo
 * 미들웨어에서 주문 존재 & 권한 체크 완료
 */
async function uploadPickupPhoto({ orderId, photoPath }) {
  // 이미지 생성
  const image = await imageRepository.create(null, {
    dlvId: orderId,
    img: photoPath,
    type: 'PICK',  // 'PICKUP' -> 'PICK'으로 통일 (images 테이블 type 참고)
  });

  // 주문 상태 업데이트
  await orderRepository.update(null, orderId, {
    status: 'pick',
  });

  return image;
}

/**
 * Upload complete photo
 * 미들웨어에서 주문 존재 & 권한 체크 완료
 */
async function uploadCompletePhoto({ orderId, photoPath }) {
  // 이미지 생성
  await imageRepository.create(null, {
    dlvId: orderId,
    img: photoPath,
    type: 'COM',  // 'COMPLETE' -> 'COM'으로 통일
  });

  // 주문 완료 처리
  const [updatedCount] = await orderRepository.update(null, orderId, {
    status: 'com',
  });

  return updatedCount;
}

// --- 3. ORDER WORKFLOW FOR RIDERS & PARTNERS & ADMIN (기사/점주/어드민) ---
/**
 * Get today's orders by tab
 * @param {Object} filter - 미들웨어에서 설정한 필터 { riderId, partnerId } or {}
 * @param {string} tab - 'waiting' | 'inprogress' | 'completed'
 * @param {number} page
 */
async function getTodayOrders({ filter, tab, page }) {
  const limit = 9;
  const offset = limit * (page - 1);

  // 오늘 날짜 범위
  const startOfDay = dayjs().startOf('day').toDate();
  const endOfDay = dayjs().endOf('day').toDate();

  // 탭별 상태 매핑
  const statusMap = {
    waiting: 'req',
    inprogress: ['match', 'pick'],
    completed: 'com',
  };

  const where = {
    ...filter,  // 미들웨어에서 설정한 필터 적용
    createdAt: { [Op.between]: [startOfDay, endOfDay] },
    status: statusMap[tab] || 'req',
  };

  return orderRepository.findAll(null, {
    where,
    limit,
    offset,
  });
}


/**
 * Get order history with pagination
 * @param {Object} filter - 미들웨어에서 설정한 필터
 */
async function getOrdersList({ filter, page, status, from, to, limit = 9 }) {
  const offset = limit * (page - 1);
  const where = { ...filter };

  if (status) where.status = status;
  if (from && to) {
    where.createdAt = { [Op.between]: [from, to] };
  }

  return await orderRepository.findAll(null, { where, limit, offset });
}

/**
 * Get details of order history 상세 조회 (Detail)
 */
async function getOrderDetail(orderId) {
  return await orderRepository.findByPk(null, orderId);
}

export default {
  createNewOrder,
  matchOrder,
  uploadPickupPhoto,
  uploadCompletePhoto,
  getTodayOrders,
  getOrdersList,
  getOrderDetail,
}