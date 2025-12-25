/**
 * @file app/repositories/hotel.repository.js
 * @description hotel Repository
 * 251222 v1.0.0 wook init
 */

import db from '../models/index.js';
const { Hotel } = db;

/**
 * 호텔 ID로 상세정보 조회
 * @param {import("sequelize").Transaction|null} t 
 * @param {{limit: number, offset: number}} id
 * @returns {Promise<Array<import("../models/Hotel.js").Hotel>>}
 */
async function findByPk(t = null, id) {
  return await Hotel.findByPk(
    id,
    {
      transaction: t,
    });
}

/**
 * 호텔 전체정보 조회
 * @param {import("sequelize").Transaction|null} t 
 * @param {{limit: number, offset: number}} data 
 * @returns {Promise<Array<import("../models/Hotel.js").Hotel>>}
 */
async function findAll(t = null) {
  return await Hotel.findAll(
    {
      transaction: t,
    })
}

/**
 * 호텔 등록
 * @param {import("sequelize").Transaction|null} t 
 * @param {{limit: number, offset: number}} data 
 * @returns {Promise<Array<import("../models/Hotel.js").Hotel>>}
 */
async function create(t = null, data) {
  return await Hotel.create(
    data,
    {
      transaction: t
    }
  )
}

export default {
  findByPk,
  findAll,
  create,
}