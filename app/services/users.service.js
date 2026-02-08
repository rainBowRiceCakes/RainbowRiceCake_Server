/**
 * @file app/serivces/users.service.js
 * @description users Service
 * 251230 wook init
 */

import db from "../models/index.js";
import orderRepository from "../repositories/order.repository.js";
import questionRepository from "../repositories/question.repository.js";
import userRepository from "../repositories/user.repository.js";

async function showIndex({ page, limit, search }) {
    const offset = limit * (page - 1);
    const result = await userRepository.showIndex(null, {limit, offset, search});
    return {
      users: result.rows,
      pagination: {
        page,
        limit,
        total: result.count,
        totalPages: Math.ceil(result.count / limit),
      }
    };
}

async function showDetail(id) {
    return await userRepository.showDetail(id);
}

async function store(data) {
  return await db.sequelize.transaction(async t => {
    const userData = await userRepository.findByEmail(t, data.email)

    if(userData) {
      throw new Error('이미 가입 된 이메일 입니다.')
    }

    return await userRepository.store(t, data);
  })
}

async function userUpdate(data) {
  return await db.sequelize.transaction(async t => {
    const dupUser = await userRepository.findByEmail(t, data.email)
    if(dupUser) {
      throw new Error('이미 가입 된 이메일 입니다.')
    }
    const result = await userRepository.findByPk(t, data.id)
    result.name = data.name
    result.email = data.email

    return await userRepository.save(t, result);
  })
}

/**
 * 모든 파트너 (제휴업체) 리스트 정보 조회 (메인페이지의 카카오 지도를 위해서.)
 * @returns 
 */
async function searchPartners() {
  return await userRepository.searchPartners();
} 

/**
 * MyPage 요약 정보 조회
 * @param {number} userId
 * @returns {Promise<object>}
 */
async function getMyPageSummary(userId) {
  const user = await userRepository.findByPk(null, userId);
  if (!user) {
    // 404 에러를 던지는 것이 더 적절할 수 있습니다.
    throw new Error('User not found');
  }

  const [orderSummaryRaw, questionSummaryRaw] = await Promise.all([
    orderRepository.findOrdersByEmail(null, { email: user.email }),
    questionRepository.findQuesionsById(null, userId)
  ]);

  return {
    userName: user.name,
    email: user.email, 
    deliveryStatus: orderSummaryRaw,
    inquiryStatus: questionSummaryRaw,
  };
}

export default {
  showIndex,
  showDetail,
  store,
  userUpdate,
  searchPartners,
  getMyPageSummary
}