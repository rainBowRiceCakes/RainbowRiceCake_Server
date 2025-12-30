/**
 * @file app/serivces/notices.service.js
 * @description notices Service
 * 251223 wook init
 */

import noticeRepository from "../repositories/notice.repository.js"

async function show() {
  return await noticeRepository.show(null)
}

async function showRole(targetRole) {
  if (!userRole) {
    throw myError('role 정보가 필요합니다.', BAD_REQUEST_ERROR);
  }

  return await noticeRepository.showRole(null, targetRole)
}

/**
 * 공지사항 조회 (id 기반)
 */
async function showDetail(t = null, id) {
  return await noticeRepository.showDetail(t, id)
}

/**
 * 공지사항 생성
 */
async function create(t = null, data) {
  return await noticeRepository.create(t, data)
}

export default {
  show,
  showRole,
  showDetail,
  create,
}