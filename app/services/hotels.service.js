/**
 * @file app/serivces/hotels.service.js
 * @description hotels Service
 * 251222 wook init
 */

import hotelRepository from "../repositories/hotel.repository.js"

async function findByPk(id) {
  return await hotelRepository.findByPk(null, id)
}

async function show({ page, limit, status, search }) {
  const offset = (page - 1) * limit;
  return await hotelRepository.findAll(null, { limit, offset, status, search })
}

async function create(data) {
  return await hotelRepository.create(null, data)
}

export default {
  findByPk,
  show,
  create,
}