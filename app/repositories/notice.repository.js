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
async function show(t = null, targetRole) {
  return await Notice.findAll(
    {
      where: {
        [Op.or]: [
          {targetRole: targetRole},
          {targetRole: 'ALL'}
        ]
      }
    },
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

export default {
  show,
  create,
}