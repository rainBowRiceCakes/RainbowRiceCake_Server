/**
 * @file app/repositories/order.repository.js
 * @description Order Repository
 * 251223 v1.0.0 BSONG init
 */

import db from '../models/index.js';
const { Order } = db;

/**
 * Order 페이지네이션
 * @param {import("sequelize").Transaction|null} t
 * @param {{limit: number, offset: number}} data
 * @returns {Promise<Array<import("../models/Order.js").Order>>}
 */
async function pagination(t = null, data) {
  return await Order.findAndCountAll({
    order: [
      ['createdAt', 'DESC'],
      ['updatedAt', 'DESC'],
      ['id', 'ASC']
    ],
    limit: data.limit,
    offset: data.offset,
    transaction: t,
  });
}

/**
 * Order ID로 조회
 * @param {import("sequelize").Transaction|null} t
 * @param {import("../services/Orders.service.type.js").Id} id
 * @returns {Promise<import("../models/Order.js").Order>}
 */
async function findByPk(t = null, id) {
  return await Order.findByPk(
    id,
    {
      transaction: t
    }
  );
}

/**
 * Order 작성
 * @param {import("sequelize").Transaction|null} t
 * @param {import("../services/Orders.service.type.js").OrderStoreData} data
 * @returns {Promise<import("../models/Order.js").Order>}
 */
async function create(t = null, data) {
  return await Order.create(data);
}

export default {
  pagination,
  findByPk,
  create,
};
