/**
 * @file app/repositories/partner.repository.js
 * @description partner Repository
 * 251223 v1.0.0 wook init
 * 251226 v1.1.0 BSONG update 유저-정보 등록 / 파트너-myinfo 가져오고 수정하기 / 어드민-개개인의 파트너들의 리스트와 정보를 가져오기 기능 추가.
 */

import { Op } from 'sequelize';
import db from '../models/index.js';
const { Partner, User } = db;

// --- 1. ADD PARTNER's INFO WORKFLOW FOR USERS ---
/**
 * 파트너 정보 등록
 * @param {import("sequelize").Transaction|null} t
 * @param {object} data - 파트너 등록 데이터
 * @returns {Promise<import("../models/Partner.js").Partner>}
 */
async function create(t = null, data) {
  return await Partner.create(data, { transaction: t });
}

// --- 2. LOOK UP and UPDATE PARTNER's INFO WORKFLOW FOR PARTNERS ---
/**
 * userId로 파트너 정보 조회 (파트너 본인 정보 조회용)
 * @param {import("sequelize").Transaction|null} t
 * @param {number} userId - 유저 ID
 * @returns {Promise<import("../models/Partner.js").Partner|null>}
 */
async function findByUserId(t = null, userId) {
  return await Partner.findOne({
    where: { userId },
    include: [
      {
        model: User,
        as: 'partner_user',
        attributes: ['id', 'name', 'email']
      }
    ],
    transaction: t
  });
}

/**
 * 파트너 정보 수정
 * @param {import("sequelize").Transaction|null} t
 * @param {number} partnerId - 파트너 ID
 * @param {object} updateData - 수정할 데이터
 * @returns {Promise<[number]>} - 수정된 행의 개수
 */
async function update(t = null, partnerId, updateData) {
  // 1. 업데이트 실행
  await Partner.update(
    updateData,
    {
      where: { id: partnerId },
      transaction: t
    }
  );

  return await Partner.findByPk(partnerId, { transaction: t });
}

// --- 3. ADMIN LOOKS UP PARTNER's INFO WORKFLOW FOR ADMIN ---
/**
 * 파트너 전체 리스트 조회 (페이징, 필터 지원)
 * @param {import("sequelize").Transaction|null} t
 * @param {object} options - 조회 옵션 (limit, offset, where 등)
 * @returns {Promise<{rows: Array<import("../models/Partner.js").Partner>, count: number}>}
 */
async function findAndCountAll(t = null, { limit, offset, status, search }) {
  const where = {};
  if (status) {
    where.status = status;
  }

  if (search) {
    where[Op.or] = [
      { krName: { [Op.like]: `%${search}%` } },
      { enName: { [Op.like]: `%${search}%` } },
    ];
  }

  return await Partner.findAndCountAll(
    {
      where,
      limit,
      offset,
      transaction: t
    }
  );
}

async function findAll(t = null) {
  return await Partner.findAll({ transaction: t })
}

/**
 * 파트너 ID로 단일 파트너 정보 조회 (관리자용)
 * @param {import("sequelize").Transaction|null} t
 * @param {number} partnerId - 파트너 ID
 * @returns {Promise<import("../models/Partner.js").Partner|null>}
 */
async function findByPk(t = null, partnerId) {
  return await Partner.findByPk(partnerId, {
    include: [
      {
        attributes: ['id', 'name', 'email', 'role', 'createdAt'],
        model: User,
        as: 'partner_user'
      }
    ],
    transaction: t
  });
}

/**
 * 승인된(RES) 파트너들의 로고 이미지 파일명 조회
 * @param {import("sequelize").Transaction|null} t 
 * @returns {Promise<Array<import("../models/Partner.js").Partner>>}
 */
async function findActivePartnerLogos(t = null) {
  return await Partner.findAll({
    attributes: ['logoImg'], // 로고 컬럼만 조회하여 최적화
    where: {
      status: 'RES' // 승인된 파트너만 조회
      // status: 'REQ'
    },
    transaction: t
  });
}

async function partnerDelete(t = null, id) {
  return await Partner.destroy({ where: { id: id } }, { transaction: t })
}

async function partnerDeleteUser(t = null, id) {
  return await Partner.destroy({ where: { userId: id } }, { transaction: t })
}



export default {
  create,
  findByUserId,
  update,
  findAndCountAll,
  findAll,
  findByPk,
  findActivePartnerLogos,
  partnerDelete,
  partnerDeleteUser,
};
