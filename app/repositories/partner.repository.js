/**
 * @file app/repositories/partner.repository.js
 * @description partner Repository
 * 251223 v1.0.0 wook init
 */

import db from '../models/index.js';
const { Partner } = db;

/**
 * 유저 id로 유저정보 조회
 * @param {import("sequelize").Transaction} t 
 * @param {number} id 
 * @returns {Promise<MessagePort("../models/Partner.js").Partner>}
 */
async function findByPk(t = null, id) {
  // PK를 이용하여 유저 찾기
  // SELECT * FROM User WHERE id = ?
  return await Partner.findByPk(id, { transaction: t });
}

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

/**
 * 매장 등록
 * @param {import("sequelize").Transaction|null} t 
 * @param {{limit: number, offset: number}} data 
 * @returns {Promise<Array<import("../models/Partner.js").Partner>>}
 */
async function create(t = null, data) {
  return await Partner.create(
    data,
    {
      transaction: t
    }
  )
}

export default {
  findByPk,
  partnerShow,
  create,
};