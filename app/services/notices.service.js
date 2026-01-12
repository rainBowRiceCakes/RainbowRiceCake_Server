/**
 * @file app/serivces/notices.service.js
 * @description notices Service
 * 251223 wook init
 */

import myError from '../errors/customs/my.error.js';
import { BAD_REQUEST_ERROR } from "../../configs/responseCode.config.js";
import noticeRepository from "../repositories/notice.repository.js"

async function show({ page, limit }) {
  const offset = (page - 1) * limit;
  return await noticeRepository.show(null, { limit, offset })
}

/**
 * 공지사항 조회 (role 기반)
 */
async function getNoticesByRole(t = null, userRole) {
  if (!userRole) {
    throw myError('role 정보가 필요합니다.', BAD_REQUEST_ERROR);
  }

  const targetRoles = [userRole, 'ALL'];
  return await noticeRepository.getNoticesByRole(t, targetRoles);
}

/**
 * 공지사항 조회 (id 기반)
 */
async function showDetail(id) {
  return await noticeRepository.showDetail(null, id)
}

/**
 * 공지사항 생성
 */
async function create(data) {
  return await noticeRepository.create(null, data)
}

export default {
  show,
  getNoticesByRole,
  showDetail,
  create,
}