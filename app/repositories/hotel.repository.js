/**
 * @file app/repositories/hotel.repository.js
 * @description hotel Repository
 * 251222 v1.0.0 wook init
 */

import { Op } from 'sequelize';
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
 * @param {{limit: number, offset: number, status: string, search: string}} data 
 * @returns {Promise<Array<import("../models/Hotel.js").Hotel>>}
 */
async function findAll(t = null, { limit, offset, status, search }) {
  const where = {};
  if (status === 'true') {
    where.status = true;
  } else if (status === 'false') {
    where.status = false;
  }

  if (search) {
    where[Op.or] = [
      { krName: { [Op.like]: `%${search}%` } },
      { enName: { [Op.like]: `%${search}%` } },
    ];
  }

  return await Hotel.findAndCountAll(
    {
      where,
      limit,
      offset,
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

async function hotelDelete(t = null, id) {
  return await Hotel.destroy({where: {id: id}}, {transaction: t})
}

export default {
  findByPk,
  findAll,
  create,
  hotelDelete,
}