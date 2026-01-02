/**
 * @file app/repositories/notice.repository.js
 * @description notice Repository
 * 251223 v1.0.0 wook init
 */

import { Op } from 'sequelize';
import db from '../models/index.js';
const { Notice } = db;

/**
 * 공지 전체 가져오기
 * @param {import("sequelize").Transaction|null} t 
 * @param {{limit: number, offset: number}} data 
 * @returns {Promise<Array<import("../models/Notice.js").Notice>>}
 */
async function show(t = null) {
  return await Notice.findAll(
    {
      transaction: t,
    })
}

/**
 * 공지 권한별로 가져오기
 * @param {import("sequelize").Transaction|null} t 
 * @param {{limit: number, offset: number}} data 
 * @returns {Promise<Array<import("../models/Notice.js").Notice>>}
 */
async function getNoticesByRole(t = null, targetRoles) {
  return Notice.findAndCountAll(
    {
      attributes: ['targetRole', 'title', 'content', 'createdAt', 'status'],
      where: {
        targetRole: {
          [Op.in]: targetRoles
        }
      },
      order: [['createdAt', 'DESC']],
      transaction: t
    }
  );
}

/**
 * 공지 단일로 가져오기
 * @param {import("sequelize").Transaction|null} t 
 * @param {{limit: number, offset: number}} data 
 * @returns {Promise<Array<import("../models/Notice.js").Notice>>}
 */
async function showDetail(t = null, id) {
  return await Notice.findByPk(
    id,
    {
      transaction: t,
    })
}

/**
 * Admin의 공지 제작(발송)
 * @param {import("sequelize").Transaction|null} t 
 * @param {{limit: number, offset: number}} data 
 * @returns {Promise<Array<import("../models/Notice.js").Notice>>}
 */
async function create(t = null, data) {
  return await Notice.create(
    data,
    {
      transaction: t
    }
  )
}

/**
 * 기본 조회 (조인 없음)
 */
async function findByPk(t = null, id) {
  return await Notice.findByPk(id, {
    transaction: t
  });
}

/**
 * 데이터 삭제
 */
async function noticeDelete(t = null, id) {
  return await Notice.destroy({
    where: {
      id: id
    }
  },
    {
      transaction: t
    });
}

export default {
  show,
  getNoticesByRole,
  showDetail,
  create,
  findByPk,
  noticeDelete,
}