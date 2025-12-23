/**
 * @file app/repositories/question.repository.js
 * @description Question Repository
 * 251223 v1.0.0 BSONG init
 */

import db from '../models/index.js';
const { Question } = db;

/**
 * Question 페이지네이션
 * @param {import("sequelize").Transaction|null} t
 * @param {{limit: number, offset: number}} data
 * @returns {Promise<Array<import("../models/Question.js").Question>>}
 */
async function pagination(t = null, data) {
  return await Question.findAndCountAll({
    order: [
      ['createdAt', 'DESC'],
      ['updatedAt', 'DESC'],
      ['id', 'ASC']
    ],
    limit: data.limit,
    offset: data.offset,
    transaction: t,
  });
}

/**
 * Question ID로 조회
 * @param {import("sequelize").Transaction|null} t
 * @param {import("../services/Questions.service.type.js").Id} id
 * @returns {Promise<import("../models/Question.js").Question>}
 */
async function findByPk(t = null, id) {
  return await Question.findByPk(
    id,
    {
      transaction: t
    }
  );
}

/**
 * Question 작성
 * @param {import("sequelize").Transaction|null} t
 * @param {import("../services/Questions.service.type.js").QuestionStoreData} data
 * @returns {Promise<import("../models/Question.js").Question>}
 */
async function create(t = null, data) {
  return await Question.create(data);
}

/**
 * Question 수정
 * @param {import("sequelize").Transaction|null} t
 * @param {number} id
 * @param {import("../services/Questions.service.type.js").QuestionUpdateData} data
 * @returns {Promise<[number]>}
 */
async function update(t = null, id, data) {
  return await Question.update(
    data,
    {
      where: { id },
      transaction: t,
    }
  );
}

export default {
  pagination,
  findByPk,
  create,
  update,
};
