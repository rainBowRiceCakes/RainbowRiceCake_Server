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
 * @param {import("../models/index.js").User} user 
 * @returns 
 */
async function save(t = null, user) {
  return await user.save({ transaction: t });
}

/**
 * Admin의 Rider정보 업데이트
 * @param {import("sequelize").Transaction|null} t 
 * @param {{limit: number, offset: number}} data 
 * @returns {Promise<Array<import("../models/Rider.js").Rider>>}
 */
async function userRoleUpdate(t = null, user) {
  return await user.save(
    {
      tarnsaction: t
    }
  )
}

export default {
  findByEmail,
  save,
  riderUpdate,
}