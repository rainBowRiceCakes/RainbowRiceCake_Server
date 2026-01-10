/**
 * @file app/services/questions.service.js
 * @description Questions Service
 * 251223 BSONG init
 * 260104 sara update - question 목록 조회 기능 추가
 * 260104 sara update - question 목록 조회 기능 추가
*/

import questionRepository from '../repositories/question.repository.js';
import db from '../models/index.js';
import userRepository from '../repositories/user.repository.js';
import ROLE from '../middlewares/auth/configs/role.enum.js'; // ROLE 상수 임포트
import myError from '../errors/customs/my.error.js';

// --- 1. ISSUE REPORT WORKFLOW (riders, partners, users) ---
/**
 * question 작성
 * @param {import("./posts.service.type.js").PostStoreData} data
 * @returns {Promise<import("../models/Post.js").Post>}
 */
async function create(createData) {

  const questionsData = {
    userId: createData.userId,   // 서비스의 authorId -> DB의 user_id
    userRole: createData.userRole, // 서비스의 userRole -> DB의 user_role
    title: createData.title,        // 제목
    content: createData.content,    // 내용
    qnaImg: createData.qnaImg,   // 서비스의 imageUrl -> DB의 qna_img
    status: false,                     // 스키마상 NOT NULL이므로 기본값 설정
    res: createData.res || null,
  }

  return await db.sequelize.transaction(async t => {
    return await questionRepository.create(t, questionsData);
  });
}

/**
 * question 작성
 * @param {import("./posts.service.type.js").PostStoreData} data
 * @returns {Promise<import("../models/Post.js").Post>}
 */
async function show({ page, limit, status, search }) {
  const offset = (page - 1) * limit;
  return await questionRepository.findAndCountAll(null, { limit, offset, status, search })
}

/**
 * 문의 상세 조회
 * 문의 목록 조회 (유저별/관리자별 권한 필터링 추가)
 * 260104 sara 추가
 * @param {Object} params
 * @param {number} params.userId - 유저 PK
 * @param {string} params.userRole - 유저 역할 (COM, DLV, PTN, ADM)
 * @returns {Promise<Array>}
 */
async function getList({ userId, userRole }) {
  const where = {};

  // 관리자(ADM)가 아닌 경우 본인의 글(userId)만 필터링합니다.
  if (userRole !== ROLE.ADM) {
    where.userId = userId; // 본인 글만 조회
  }

  // 필터 조건을 Repository의 findAllWithUser 함수로 넘깁니다.
  return await questionRepository.findAllWithUser(null, where);
}

/**
 * 문의 상세 조회
 * @param {import("./posts.service.type.js").PostStoreData} data
 * @returns {Promise<import("../models/Post.js").Post>}
 */
async function showDetail(id) {
  return await db.sequelize.transaction(async t => {
    const qnaInfo = await questionRepository.findByPk(t, id)
    // 2. 데이터 존재 여부 체크 (변수명 통일)
    if (!qnaInfo) {
      throw myError("존재하지 않는 문의 내역입니다.");
    }

    return qnaInfo.get({ plain: true });
  })
}

export default {
  create,
  show,
  getList, // sara 추가(260104)
  showDetail,
};
