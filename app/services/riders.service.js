/**
 * @file app/serivces/riders.service.js
 * @description riders Service
 * 251223 wook init
 */

import riderRepository from "../repositories/rider.repository.js";

async function riderShow() {
  await riderRepository.riderShow(null);
}

async function create(data) {
  await riderRepository.create(null, data);
}

export default {
  riderShow,
  create,
}