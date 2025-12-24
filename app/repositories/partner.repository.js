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

/**
 * 파트너 form 정보 create 처리
 * @param {import("sequelize").Transaction} t 
 * @param {import("../models/index.js").Rider} rider
 * @returns 
 */
async function partnerformCreate(t = null, data) {
  return await Rider.create({ 
      manager: data.manager,
      phone: data.phone,
      krName: data.krName,
      enName: data.enName,
      businessNum: data.businessNum,
      address: data.address,
      logoImg: data.logoImg
  }, { transaction: t });
}

export default {
  findByPk,
  partnerShow,
  create,
  partnerformCreate
};