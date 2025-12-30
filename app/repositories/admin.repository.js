/**
 * @file app/repositories/admin.repository.js
 * @description admin Repository
 * 251223 v1.0.0 wook init
 */

import db from '../models/index.js';
const { Admin } = db;

/**
 * Admin의 Rider정보 업데이트
 * @param {import("sequelize").Transaction|null} t 
 * @param {{limit: number, offset: number}} data 
 * @returns {Promise<Array<import("../models/Rider.js").Rider>>}
 */
async function riderUpdate(t = null, result) {
  return await result.save(
    {
      transaction: t
    }
  )
}

/**
 * Admin의 Partner정보 업데이트
 * @param {import("sequelize").Transaction|null} t 
 * @param {{limit: number, offset: number}} data 
 * @returns {Promise<Array<import("../models/Partner.js").Partner>>}
 */
async function partnerUpdate(t = null, result) {
  return await result.save(
    {
      transaction: t
    }
  )
}

/**
 * Admin의 Hotel정보 업데이트
 * @param {import("sequelize").Transaction|null} t 
 * @param {{limit: number, offset: number}} data 
 * @returns {Promise<Array<import("../models/Hotel.js").Hotel>>}
 */
async function hotelUpdate(t = null, result) {
  return await result.save(
    {
      transaction: t
    }
  )
}

/**
 * Admin의 Hotel정보 업데이트
 * @param {import("sequelize").Transaction|null} t 
 * @param {{limit: number, offset: number}} data 
 * @returns {Promise<Array<import("../models/Hotel.js").Hotel>>}
 */
async function orderUpdate(t = null, result) {
  return await result.save(
    {
      transaction: t
    }
  ) 
}

/**
 * 이메일로 어드민 검색
 * @param {import("sequelize").Transaction} t 
 * @param {string} email 
 * @returns 
 */
async function findByEmail(t = null, email) {
  return await Admin.findOne(
    {
      where: {
        email: email
      },
      transaction: t
    }
  );
}

/**
 * 어드민 모델 인스턴스로 save 처리
 * @param {import("sequelize").Transaction} t 
 * @param {import("../models/index.js").Admin} admin 
 * @returns 
 */
async function save(t = null, admin) {
  return await admin.save({ transaction: t });
}

async function logout(t = null, id) {
  // 특정 어드민 리프래시토큰 null로 갱신
  // 평문 : UPDATE admins SET refresh_token = null WHERE id = ?
  return await Admin.update(
    // 파라미터 2개: {바꿀값}{옵션(조건)}
    {
      refreshToken: null
    },
    {
      where: {
        id: id
      },
      transaction: t
    }
  );
}

export default {
  findByEmail,
  riderUpdate,
  partnerUpdate,
  hotelUpdate,
  orderUpdate,
  save,
  logout,
}