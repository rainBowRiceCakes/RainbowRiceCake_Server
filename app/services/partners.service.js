/**
 * @file app/serivces/partners.service.js
 * @description partners Service
 * 251223 wook init
 */

import partnerRepository from "../repositories/partner.repository.js";

async function partnerShow() {
  return await partnerRepository.partnerShow(null);
}

async function create(data) {
  return await partnerRepository.create(null, data)
}

export default {
  partnerShow,
  create,
}