/**
 * @file app/serivces/partners.service.js
 * @description partners Service
 * 251223 wook init
 */

import db from "../models/index.js";
import partnerRepository from "../repositories/partner.repository.js";

async function partnerShow() {
  return await partnerRepository.partnerShow(null);
}

async function create(data) {
  return await partnerRepository.create(null, data)
}

/**
 * 파트너 form 작성
 * @param {import("./users.service.type.js").riderStoreData} data
 */
async function partnerStore(data) {
  return await db.sequelize.transaction(async t => {
    return await partnerRepository.create(t, data);
  })
}

export default {
  partnerShow,
  create,
  partnerStore
}