/**
 * @file app/serivces/notices.service.js
 * @description notices Service
 * 251223 wook init
 */

import noticeRepository from "../repositories/notice.repository.js"

async function show(data) {
  return await noticeRepository.show(null, data.targetRole)
}

async function create(data) {
  return await noticeRepository.create(null, data)
}

export default {
  show,
  create,
}