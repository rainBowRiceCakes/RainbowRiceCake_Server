/**
 * @file app/repositories/hotel.repository.js
 * @description hotel Repository
 * 251222 v1.0.0 wook init
 */

import db from '../models/index.js';
const { Hotel } = db;

/**
 * 호텔 전체 페이지네이션
 * @param {import("sequelize").Transaction|null} t 
 * @param {{limit: number, offset: number}} data 
 * @returns {Promise<Array<import("../models/Hotel.js").Hotel>>}
 */
async function latestPagination(t = null, data) {
  return await Hotel.findAll(
    {
      order: [
        ['createdAt', 'DESC'],
        ['id', 'ASC']
      ],
      limit: data.limit,
      offset: data.offset,
      transaction: t,
    })
}

/**
 * 호텔 활동중 페이지네이션
 * @param {import("sequelize").Transaction|null} t 
 * @param {{limit: number, offset: number}} data 
 * @returns {Promise<Array<import("../models/Hotel.js").Hotel>>}
 */
async function statusPagination(t = null, data) {
  // SELECT * FROM Hotel
  return await Hotel.findAll(
    {
      where: {
        status: 'res'
      }
    },
    {
      order: [
        ['createdAt', 'DESC'],
        ['id', 'ASC']
      ],
      limit: data.limit,
      offset: data.offset,
      transaction: t,
    })
}

/**
 * 호텔 활동중 페이지네이션
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
  latestPagination,
  statusPagination,
  create,
}