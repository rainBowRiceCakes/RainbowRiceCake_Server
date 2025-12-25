/**
 * @file app/serivces/hotels.service.js
 * @description hotels Service
 * 251222 wook init
 */

import hotelRepository from "../repositories/hotel.repository.js"

async function findByPk(id) {
  return await hotelRepository.findByPk(null, id)
}

async function show(page) {
  const limit = 9;
  const offset = limit * (page - 1);
  
  return await hotelRepository.latestPagination(null, { limit, offset })
  // return await hotelRepository.statusPagination(null, { limit, offset })
}

async function create(data) {
  return await hotelRepository.create(null, data)
}

export default {
  findByPk,
  show,
  create,
}