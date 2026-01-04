/**
 * @file app/repositories/question.repository.js
 * @description Question Repository
 * 251223 v1.0.0 BSONG init
 * 260104 v1.0.1 sara update (필터링 및 조인 기능 추가)
 */

import { Op } from 'sequelize';
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

/**
 * 문의 목록 조회 (필터링 및 작성자 이름 조인)
 * sara 260104 추가
 * @param {import("sequelize").Transaction|null} t - 트랜잭션 객체
 * @param {Object} where - 필터 조건 (userId 등)
 * @returns {Promise<Array>}
 */
async function findAllWithUser(t = null, where = {}) {
  return await Question.findAll({
    where, // 서비스에서 넘겨준 필터(본인 ID 혹은 전체) 적용
    include: [
      {
        model: User,
        as: 'question_user', // 모델 정의 시 설정한 alias
        attributes: ['name'], // 이름만 가져와서 최적화
      }
    ],
    order: [['createdAt', 'DESC']], // 최신순 정렬
    transaction: t,
  });
}

/**
 * QnA 전체 목록 조회 (페이징, 필터, 검색 지원)
 * @param {import("sequelize").Transaction|null} t
 * @param {{limit: number, offset: number, status: string, search: string}} options
 * @returns {Promise<{rows: Array<import("../models/Question.js").Question>, count: number}>}
 */
async function findAndCountAll(t = null, { limit, offset, status, search }) {
  const where = {};
  if (status !== undefined) {
    // status는 문자열 'true' 또는 'false'로 넘어오므로 boolean으로 변환
    where.status = (status === 'true'); 
  }

  const include = [
    {
      attributes: ['name'],
      model: User,
      as: 'question_user',
      required: false, // LEFT JOIN (검색 시에도 회원이 없을 수 있으므로)
    }
  ];

  if (search) {
    where[Op.or] = [
      { title: { [Op.like]: `%${search}%` } },
      // User 이름으로 검색 (include 안의 where)
      { '$question_user.name$': { [Op.like]: `%${search}%` } }
    ];
  }

  return await Question.findAndCountAll(
    {
      where,
      include,
      limit,
      offset,
      order: [['createdAt', 'DESC']], // 최신순 정렬
      transaction: t,
    }
  )
}

async function findByPk(t = null, id) {
  return await Question.findByPk(id, {
    include: [
      {
        attributes: ['name'],
        model: User,
        as: 'question_user',
      }
    ],
    transaction: t
  })
}

export default {
  create,
  qnaDelete,
  findAndCountAll, // 페이징, 필터, 검색 지원
  findAllWithUser, // 필터 및 작성자 이름 조인
  findByPk,
};

// Repository (DB 중심)	HTTP Method
// 전체 목록 조회	findAll / pagination	GET
// 특정 조건 조회	findDailyOrders	GET (custom)
// 상세 데이터 조회	findByPk	GET
// 새 데이터 생성-저장	create POST
// 데이터 수정	update	PUT
// 데이터 삭제	destroy	DELETE