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
async function create(data) {
  return await db.sequelize.transaction(async t => {
    return await questionRepository.create(t, data);
  });
}

export default {
  create,
};
