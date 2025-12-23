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
 * 유저 모델 인스턴스로 save 처리
 * @param {import("sequelize").Transaction} t 
 * @param {import("../models/index.js").User} user 
 * @returns 
 */
async function save(t = null, user) {
  return await user.save({ transaction: t });
}

async function create(t = null, data) {
  console.log(data);
  return await User.create({ email:data.email, name:data.nick, role:data.role }, { transaction: t });
}

export default {
  findByEmail,
  save,
  riderToUserPK,
  create,
}