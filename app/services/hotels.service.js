/**
 * @file app/serivces/hotels.service.js
 * @description hotels Service
 * 251222 wook init
 */

import hotelRepository from "../repositories/hotel.repository.js"

async function findByPk(id) {
  return await hotelRepository.findByPk(null, id)
}

async function show() {
  return await hotelRepository.findAll(null)
}

async function create(data) {
  return await hotelRepository.create(null, data)
}

export default {
  findByPk,
  show,
  create,
}