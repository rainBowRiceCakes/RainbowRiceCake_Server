/**
 * @file app/serivces/riders.service.js
 * @description riders Service
 * 251223 wook init
 */

import db from "../models/index.js";
import riderRepository from "../repositories/rider.repository.js";
import userRepository from "../repositories/user.repository.js";

/**
 * Rider PK로 한명의 정보 + 유저데이터 모두 가져오는 처리
 */
async function riderFindByPk(id) {
    return await riderRepository.findByPk(null, id);
}

/**
 * Rider테이블의 정보 + 유저이름 모두 가져오는 처리
 */
async function riderShow() {
  return await riderRepository.riderShow(null);
}

/**
 * Rider테이블의 정보 등록하는 처리
 * @param {import("./users.service.type.js").riderStoreData} data
 */
async function create(data) {
  return await riderRepository.create(null, data);
}

/**
 * 라이더 form 작성
 * @param {import("./users.service.type.js").riderStoreData} data
 */
async function riderStore(data) {
  return await db.sequelize.transaction(async t => {
    return await riderRepository.riderFormCreate(t, data);
  })
}

export default {
  riderFindByPk,
  riderShow,
  create,
  riderStore,
}