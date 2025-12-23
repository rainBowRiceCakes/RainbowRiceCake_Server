/**
 * @file app/repositories/partner.repository.js
 * @description partner Repository
 * 251223 v1.0.0 wook init
 */

import db from '../models/index.js';
const { Partner } = db;

/**
 * 호텔 전체 페이지네이션
 * @param {import("sequelize").Transaction|null} t 
 * @param {{limit: number, offset: number}} data 
 * @returns {Promise<Array<import("../models/Partner.js").Partner>>}
 */
async function partnerShow(t = null) {
  return await Partner.findAll(
    {
      transaction: t,
    })
}

export default {
  partnerShow
};