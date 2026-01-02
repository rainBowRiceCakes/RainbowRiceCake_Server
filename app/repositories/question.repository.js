/**
 * @file app/repositories/question.repository.js
 * @description Question Repository
 * 251223 v1.0.0 BSONG init
 */

import db from '../models/index.js';
const { Question, User } = db;

/**
 * Question 작성
 * @param {import("sequelize").Transaction|null} t
 * @param {import("../services/Questions.service.type.js").QuestionStoreData} data
 * @returns {Promise<import("../models/Question.js").Question>}
 */
async function create(t = null, data) {
  return await Question.create(data);
}

async function qnaDelete(t = null, id) {
  return await Question.destroy({where: {id: id}}, {transaction: t})
}

async function show(t = null) {
  return await Question.findAll(
    {
      include: [
        {
          attributes: ['name'],
          model: User,
          as: 'question_user',
        }
      ],
      transaction: t,
    }
  )
}

async function findByPk(t = null, id) {
  return await Question.findByPk(id, {transaction: t})
}

export default {
  create,
  qnaDelete,
  show,
  findByPk,
};

// Repository (DB 중심)	HTTP Method
// 전체 목록 조회	findAll / pagination	GET
// 특정 조건 조회	findDailyOrders	GET (custom)
// 상세 데이터 조회	findByPk	GET
// 새 데이터 생성-저장	create POST
// 데이터 수정	update	PUT
// 데이터 삭제	destroy	DELETE