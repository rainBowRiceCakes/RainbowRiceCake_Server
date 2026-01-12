/**
 * @file app/repositories/question.repository.js
 * @description Question Repository
 * 251223 v1.0.0 BSONG init
 * 260104 v1.0.1 sara update (필터링 및 조인 기능 추가)
 * 260104 v1.0.1 sara update (필터링 및 조인 기능 추가)
 */

import { Op } from 'sequelize';
import db from '../models/index.js';
const { Question, User, Partner, Rider } = db;

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
  return await Question.destroy({ where: { id: id } }, { transaction: t })
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
    where,
    // 1. Question 테이블: 리스트에 필요한 핵심 정보만
    attributes: ['id', 'title', 'status', 'createdAt'],
    include: [
      {
        model: User,
        as: 'question_user',
        // 2. 작성자 이름과 역할(ADM, PARTNER, RIDER 구분용)만 가져옴
        attributes: ['name'],
        // Partner, Rider 조인이 리스트에서 정말 필요 없다면 여기서 중첩 include를 삭제하세요.
      }
    ],
    order: [['createdAt', 'DESC']],
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
    // 1. 상세 페이지이므로 모든 컬럼을 가져오기 위해 attributes를 생략하거나 전체 명시합니다.
    include: [
      {
        model: User,
        as: 'question_user',
        attributes: ['id', 'name', 'role', 'email'],
        include: [
          {
            model: Partner,
            as: 'user_partner',
            attributes: ['krName'], // 상세에 필요한 업체 정보
            required: false,
          },
          {
            model: Rider,
            as: 'user_rider',
            attributes: ['phone'], // 상세에 필요한 기사 정보
            required: false,
          }
        ]
      }
    ],
    transaction: t, // 트랜잭션은 null로 들어오겠지만 확장성을 위해 인자는 남겨둡니다.
  });
}

/**
 * id로 문의 현황 전부 불러오기 
 * @param {import("sequelize").Transaction} t
 * @param {number} userId
 * @returns {Promise<Array<{status: boolean, count: number}>>}
 */
async function findQuesionsById(t = null, userId) {
  return await Question.findAll({
    where: { userId },
    transaction: t,
  });
}

export default {
  create,
  qnaDelete,
  findAndCountAll, // 페이징, 필터, 검색 지원
  findAllWithUser, // 필터 및 작성자 이름 조인
  findByPk,
  findQuesionsById,
};

// Repository (DB 중심)	HTTP Method
// 전체 목록 조회	findAll / pagination	GET
// 특정 조건 조회	findDailyOrders	GET (custom)
// 상세 데이터 조회	findByPk	GET
// 새 데이터 생성-저장	create POST
// 데이터 수정	update	PUT
// 데이터 삭제	destroy	DELETE