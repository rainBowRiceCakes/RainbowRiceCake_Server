/**
 * @file app/services/questions.service.js
 * @description Questions Service
 * 251223 BSong init
 */

import questionRepository from '../repositories/question.repository.js';
import db from '../models/index.js';
import { NOT_FOUND_ERROR, UNPROCESSABLE_ENTITY_ERROR } from '../../configs/responseCode.config.js';
import myError from '../errors/customs/my.error.js';

/**
 * question 페이지네이션
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

/**
 * question 답변 작성 (for Admin)
 * @param {number} id
 * @param {import("./posts.service.type.js").QuestionRespondData} data
 * @returns {Promise<void>}
 */
async function createResponse(id, data) {
  return await db.sequelize.transaction(async t => {
    const question = await questionRepository.findByPk(t, id);

    if (!question) {
      throw myError('존재하지 않는 질문입니다.', NOT_FOUND_ERROR);
    }

    if (question.status === true) {
      throw myError('이미 답변된 질문입니다.', UNPROCESSABLE_ENTITY_ERROR);
    }

    await questionRepository.update(t, id, {
      respond: data.respond,
      status: true,
    });
  });
}

export default {
  pagination,
  show,
  create,
  createResponse,
};
