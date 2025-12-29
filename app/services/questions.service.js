/**
 * @file app/services/questions.service.js
 * @description Questions Service
 * 251223 BSONG init
*/

import questionRepository from '../repositories/question.repository.js';
import db from '../models/index.js';

// --- 1. ISSUE REPORT WORKFLOW (riders, partners, users) ---
/**
 * question 작성
 * @param {import("./posts.service.type.js").PostStoreData} data
 * @returns {Promise<import("../models/Post.js").Post>}
 */
async function create(createData) {

  const questionsData = {
    // authorId: createData.userid, // 인증된 사용자의 ID
    // position: createData.userRole, // 사용자의 역할 (rider, partner, user 등)
    title: createData.title, // 질문 제목
    content: createData.content, // 질문 내용
    imageUrl: createData.qnaImg, // 첨부 이미지 URL (선택적)
  }

  return await db.sequelize.transaction(async t => {
    return await questionRepository.create(t, questionsData);
  });
}

export default {
  create,
};
