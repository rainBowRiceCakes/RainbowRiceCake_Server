/**
 * @file app/repositories/admin.repository.js
 * @description admin Repository
 * 251223 v1.0.0 wook init
 */

import db from '../models/index.js';
const { Rider } = db;

/**
 * Admin의 Rider정보 업데이트
 * @param {import("sequelize").Transaction|null} t 
 * @param {{limit: number, offset: number}} data 
 * @returns {Promise<Array<import("../models/Rider.js").Rider>>}
 */
async function riderUpdate(t = null, result) {
  return await result.save(
    {
      transaction: t
    }
  )
}

export default {
  riderUpdate,
}