/**
 * @file app/serivces/partners.service.js
 * @description partners Service
 * 251223 wook init
 */

import db from "../models/index.js";
import partnerRepository from "../repositories/partner.repository.js";

/**
 * Partner테이블의 정보 모두 가져오는 처리
 */
async function partnerShow() {
  return await partnerRepository.partnerShow(null);
}

/**
 * Partner테이블의 정보 등록하는 처리
 */
async function create(data) {
  return await partnerRepository.create(null, data)
}

/**
 * 파트너 form 작성
 * @param {import("./users.service.type.js").partnerStoreData} data
 */
async function partnerStore(data) {
  return await db.sequelize.transaction(async t => {
    return await partnerRepository.create(t, data);
  })
}

async function findByPk(id) {
  return await partnerRepository.findByPk(null, id)
}

export default {
  partnerShow,
  create,
  partnerStore,
  findByPk,
}