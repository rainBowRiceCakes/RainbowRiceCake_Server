/**
 * @file app/services/questions.service.js
 * @description Questions Service
 * 251223 BSONG init
 */

import questionRepository from '../repositories/question.repository.js';
import db from '../models/index.js';

/**
 * Get unanswered questions with pagination (for Admin)
 * @param {import("./posts.service.type.js").page} page - 페이지 번호
 * @returns {Promise<Array<import("../models/Post.js").Post>>}
 */
async function pagination(page) {
  const limit = 6;
  const offset = limit * (page - 1);

  return await questionRepository.pagination(null, { limit, offset });
}

/**
 * question 상세
 * @param {import("./posts.service.type.js").Id} id
 * @returns {Promise<import("../models/Post.js").Post>}
 */
async function show(id) {
  return await questionRepository.findByPk(null, id);
}

/**
 * question 작성
 * @param {import("./posts.service.type.js").PostStoreData} data
 * @returns {Promise<import("../models/Post.js").Post>}
 */
async function create(data) {
  return await db.sequelize.transaction(async t => {
    return await questionRepository.create(t, data);
  });
}

export default {
  pagination,
  show,
  create
};
