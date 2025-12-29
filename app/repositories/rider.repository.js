/**
 * @file app/repositories/rider.repository.js
 * @description rider Repository
 * 251223 v1.0.0 wook init
 */

import db from '../models/index.js';
const { Rider, User } = db;

// --- 1. MY PROFILE WORKFLOW FOR RIDERS (기사와 관련된 profile 불러오기 & 업데이트) ---
/**
 * userId로 기사 정보 조회 (기사 본인 정보 조회용)
 * @param {import("sequelize").Transaction|null} t
 * @param {number} userId - 유저 ID
 * @returns {Promise<import("../models/Partner.js").Partner|null>}
 */
async function findByUserId(t = null, userId) {
  return await Rider.findOne({
    where: { userId },
    include: [
      {
        model: User,
        as: 'rider_user',
        attributes: ['id', 'name', 'email']
      }
    ],
    transaction: t
  });
}

/**
 * 기사 본인 정보 자기가 수정
 * @param {import("sequelize").Transaction|null} t
 * @param {number} riderId - 라이더 ID
 * @param {object} updateData - 수정할 데이터
 * @returns {Promise<[number]>} - 수정된 행의 개수
 */
async function update(t = null, riderId, updateData) {
  return await Rider.update(
    updateData,
    {
      where: { id: riderId },
      transaction: t
    }
  );
}

// -------------------------------------------------------------------------------------------

/**
 * 기사 id로 기사정보 조회
 * @param {import("sequelize").Transaction} t
 * @param {number} id
 * @returns {Promise<MessagePort("../models/Rider.js").Rider>}
 */
async function findByPk(t = null, id) {
  // PK를 이용하여 유저 찾기
  // SELECT * FROM User WHERE id = ?
  return await Rider.findByPk(id,
    {
      include: [
        {
          attributes: ['name'],
          model: User,
          as: 'rider_user',
        }
      ],
      transaction: t
    });
}

/**
 * 기사 전체정보 조회
 * @param {import("sequelize").Transaction|null} t
 * @param {{limit: number, offset: number}} data
 * @returns {Promise<Array<import("../models/Rider.js").Rider>>}
 */
async function riderShow(t = null) {
  return await Rider.findAll(

    {
      include: [
        {
          attributes: ['name'],
          model: User,
          as: 'rider_user',
        }
      ],
    transaction: t,
    })
}

/**
 * 기사 정보 등록
 * @param {import("sequelize").Transaction|null} t
 * @param {{limit: number, offset: number}} data
 * @returns {Promise<Array<import("../models/Rider.js").Rider>>}
 */
async function create(t = null, data) {
  return await Rider.create(
    data,
    {
      transaction: t
    }
  )
}

// /**
//  * 라이더 form 정보 create 처리
//  * @param {import("sequelize").Transaction} t
//  * @param {import("../models/index.js").Rider} rider
//  * @returns
//  */
// async function riderFormCreate(t = null, data) {
//   return await Rider.create(data, { transaction: t });
// }

export default {
  findByUserId,
  update,
  findByPk,
  riderShow,
  create,
  // riderFormCreate
};
