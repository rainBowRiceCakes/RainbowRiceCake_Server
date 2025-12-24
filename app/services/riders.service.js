/**
 * @file app/serivces/riders.service.js
 * @description riders Service
 * 251223 wook init
 */

import db from "../models/index.js";
import riderRepository from "../repositories/rider.repository.js";

async function riderShow() {
  return await riderRepository.riderShow(null);
}

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
  riderShow,
  create,
  riderStore,
}