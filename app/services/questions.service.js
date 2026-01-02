/**
 * @file app/services/questions.service.js
 * @description Questions Service
 * 251223 BSONG init
*/

import questionRepository from '../repositories/question.repository.js';
import db from '../models/index.js';
import userRepository from '../repositories/user.repository.js';

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
async function show() {
  return await questionRepository.show(null)
}

/**
 * question 작성
 * @param {import("./posts.service.type.js").PostStoreData} data
 * @returns {Promise<import("../models/Post.js").Post>}
 */
async function showDetail(id) {
  return await db.sequelize.transaction(async t => {
    const qnaInfo = await questionRepository.findByPk(t, id)
    // userID로 name 가져오기
    const user = await userRepository.findByPk(t, qnaInfo.userId)
    qnaInfo.name = user.name
    return qnaInfo
  })
}

export default {
  create,
  show,
  showDetail,
};
