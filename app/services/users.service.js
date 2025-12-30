/**
 * @file app/serivces/users.service.js
 * @description users Service
 * 251230 wook init
 */

import db from "../models/index.js";
import userRepository from "../repositories/user.repository.js";

async function showIndex({ page, limit}) {
    const offset = limit * (page - 1);
    const result = await userRepository.showIndex(null, {limit, offset});
    return {
      users: result.rows,
      pagination: {
        page,
        limit,
        total: result.count,
        totalPages: Math.ceil(result.count / limit),
      }
    };
}

async function showDetail(id) {
    return await userRepository.findByPk(null, id);
}

async function store(data) {
  return await db.sequelize.transaction(async t => {
    const userData = await userRepository.findByEmail(t, data.email)

    if(userData) {
      throw new Error('이미 가입 된 이메일 입니다.')
    }

    return await userRepository.store(t, data);
  })
}

async function userUpdate(data) {
  return await db.sequelize.transaction(async t => {
    const dupUser = await userRepository.findByEmail(t, data.email)
    if(dupUser) {
      throw new Error('이미 가입 된 이메일 입니다.')
    }
    const result = await userRepository.findByPk(t, data.id)
    result.name = data.name
    result.email = data.email

    return await userRepository.save(t, result);
  })
}

export default {
  showIndex,
  showDetail,
  store,
  userUpdate,
}