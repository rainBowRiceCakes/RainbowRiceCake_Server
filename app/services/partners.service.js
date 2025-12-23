/**
 * @file app/serivces/partners.service.js
 * @description partners Service
 * 251223 wook init
 */

import partnerRepository from "../repositories/partner.repository.js";

async function partnerShow() {
  return await partnerRepository.partnerShow(null);
}

export default {
  partnerShow,
}