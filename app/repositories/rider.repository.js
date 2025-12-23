/**
 * @file app/repositories/rider.repository.js
 * @description rider Repository
 * 251223 v1.0.0 wook init
 */

import db from '../models/index.js';
const { Rider } = db;

/**
 * 유저 id로 유저정보 조회
 * @param {import("sequelize").Transaction} t 
 * @param {number} id 
 * @returns {Promise<MessagePort("../models/Rider.js").Rider>}
 */
async function findByPk(t = null, id) {
  // PK를 이용하여 유저 찾기
  // SELECT * FROM User WHERE id = ?
  return await Rider.findByPk(id, { transaction: t });
}

/**
 * 호텔 전체 페이지네이션
 * @param {import("sequelize").Transaction|null} t 
 * @param {{limit: number, offset: number}} data 
 * @returns {Promise<Array<import("../models/Rider.js").Rider>>}
 */
async function riderShow(t = null) {
  return await Rider.findAll(
    {
      transaction: t,
    })
}

async function create(t = null, data) {
  return await Rider.create(
    data,
    {
      transaction: t
    }
  )
}

export default {
  findByPk,
  riderShow,
  create,
};