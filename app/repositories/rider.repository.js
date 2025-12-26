/**
 * @file app/repositories/rider.repository.js
 * @description rider Repository
 * 251223 v1.0.0 wook init
 */

import db from '../models/index.js';
const { Rider, User } = db;

/**
 * 기사 id로 기사정보 조회
 * @param {import("sequelize").Transaction} t 
 * @param {number} id 
 * @returns {Promise<MessagePort("../models/Rider.js").Rider>}
 */
async function findByPk(t = null, id) {
  // PK를 이용하여 유저 찾기
  // SELECT * FROM User WHERE id = ?
  return await Rider.findByPk(id,
    {
      include: [
        {
          attributes: ['name'],
          model: User,
          as: 'rider_user',
        }
      ],
      transaction: t
    });
}

/**
 * 기사 전체정보 조회
 * @param {import("sequelize").Transaction|null} t 
 * @param {{limit: number, offset: number}} data 
 * @returns {Promise<Array<import("../models/Rider.js").Rider>>}
 */
async function riderShow(t = null) {
  return await Rider.findAll(
    
    {
      include: [
        {
          attributes: ['name'],
          model: User,
          as: 'rider_user',
        }
      ],
    transaction: t,
    })
}

/**
 * 기사 정보 등록
 * @param {import("sequelize").Transaction|null} t 
 * @param {{limit: number, offset: number}} data 
 * @returns {Promise<Array<import("../models/Rider.js").Rider>>}
 */
async function create(t = null, data) {
  return await Rider.create(
    data,
    {
      transaction: t
    }
  )
}

// /**
//  * 라이더 form 정보 create 처리
//  * @param {import("sequelize").Transaction} t 
//  * @param {import("../models/index.js").Rider} rider
//  * @returns 
//  */
// async function riderFormCreate(t = null, data) {
//   return await Rider.create(data, { transaction: t });
// }

export default {
  findByPk,
  riderShow,
  create,
  // riderFormCreate
};