/**
 * @file app/repositories/user.repository.js
 * @description User Repository
 * 251222 v1.0.0 jun 초기 생성
 */

import db from '../models/index.js';

const { User } = db;

/**
 * 이메일로 유저 검색
 * @param {import("sequelize").Transaction} t 
 * @param {string} email 
 * @returns 
 */
async function findByEmail(t = null, email) {
  return await User.findOne(
    {
      where: {
        email: email
      },
      transaction: t
    }
  );
}

/**
 * Rider의 user_id로 유저PK 검색
 * @param {import("sequelize").Transaction} t 
 * @param {import("../models/index.js").User} user 
 * @returns 
 */
async function riderToUserPK(t = null, userId) {
  return await User.findOne(
    {
      where: {
        id: userId
      },
      transaction: t
    }
  );
}

/**
 * Partner의 user_id로 유저PK 검색
 * @param {import("sequelize").Transaction} t 
 * @param {import("../models/index.js").User} user 
 * @returns 
 */
async function partnerToUserPK(t = null, userId) {
  return await User.findOne(
    {
      where: {
        id: userId
      },
      transaction: t
    }
  );
}

/**
 * 유저 모델 인스턴스로 save 처리
 * @param {import("sequelize").Transaction} t 
 * @param {import("../models/index.js").User} user 
 * @returns 
 */
async function save(t = null, user) {
  return await user.save({ transaction: t });
}

/**
 * 유저 정보 create 처리
 * @param {import("sequelize").Transaction} t 
 * @param {import("../models/index.js").User} user 
 * @returns 
 */
async function create(t = null, data) {
  console.log(data);
  return await User.create({ email:data.email, name:data.nick, role:data.role }, { transaction: t });
}

/**
 * 유저 id로 유저 정보 조회
 * @param {import("sequelize").Transaction} t 
 * @param {number} id
 * @returns {promise<import("../models/User.js").User>}
 */
async function findByPk(t = null, id) {
  return await User.findByPk(id, { transaction: t });
}


async function logout(t = null, id) {
  // 특정 유저 리프래시토큰 null로 갱신
  // 평문 : UPDATE users SET refresh_token = null WHERE id = ?
  return await User.update(
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

// 유저 권한 변경 (COM -> DLV, PTN)
/**
 * 유저 권한(Role) 변경
 * @param {import("sequelize").Transaction} t 
 * @param {number} id 
 * @param {string} role 'DLV' | 'PTN' | 'ADM' ...
 * @returns 
 */
async function updateRole(t = null, id, role) {
  return await User.update(
    { role: role },
    {
      where: { id: id },
      transaction: t
    }
  );
}

export default {
  findByEmail,
  save,
  riderToUserPK,
  partnerToUserPK,
  findByPk,
  create,
  logout,
  updateRole,
}