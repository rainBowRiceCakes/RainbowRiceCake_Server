/**
 * @file app/repositories/order.repository.js
 * @description Order Repository (주문 등록, 주문 목록 조회, 주문 상세 조회)
 * 251223 v1.0.0 BSONG init
 * 251225 v1.1.0 BSONG update - 상태별 주문 목록 및 카운트 조회 기능 추가, 그리고 주문 히스토리 상세 조회 기능 추가
*/

import db from '../models/index.js';
const { Order, Partner, Hotel, Sequelize } = db;

/**
 * Create a new order (주문 등록 - partner 가 생성)
 * @param {import("sequelize").Transaction|null} t
 * @param {import("../services/Orders.service.type.js").OrderStoreData} data
 * @returns {Promise<import("../models/Order.js").Order>}
 */
async function create(t = null, data) {
  return await Order.create(data);
}

/**
 * 이 query가 사용 되는 곳
 * 1. List of order history 를 ALL 조회 (페이지네이션)
 * 2. Get List of Orders for the day by Tab (상태별 주문 목록 조회)
 * 비즈니스 로직은 서비스 레이어에서 처리!
 * @param {import("sequelize").Transaction|null} t
 * @param {object} data
 * @param {object} data.where - 필터 조건 객체
 * @param {number} data.limit
 * @param {number} data.offset
 * @returns {Promise<Array<import("../models/Order.js").Order>>}
 */
async function findAll(t = null, { where, limit, offset }) {
  return await Order.findAndCountAll({
    where, // 서비스에서 조립된 필터
    order: [
      ['createdAt', 'DESC'],
      ['updatedAt', 'DESC'],
      ['id', 'ASC']
    ],
    limit,
    offset,
    transaction: t,
        include: [
      {
        attributes: ['id', 'user_id', 'store_kr_name', 'store_en_name', 'manager', 'phone', 'status', 'address', 'latitude', 'longitude'], 
        model: Partner, // Pickup Point
        as: 'order_partner',
        required: true // INNER JOIN (Order must have a partner)
      },
      {
        attributes: ['id', 'hotel_kr_name', 'hotel_en_name', 'manager', 'phone', 'status', 'address', 'latitude', 'longitude'],
        model: Hotel, // Delivery Destination
        as: 'order_hotel',
        required: true 
      }
    ],
    attributes: ['id', 'status', 'price', 'cnt_s', 'cnt_m', 'cnt_l', 'createdAt']
  });
}

/**
 * Details of order history를 ID로 조회
 * @param {import("sequelize").Transaction|null} t
 * @param {import("../services/Orders.service.type.js").Id} id
 * @returns {Promise<import("../models/Order.js").Order>}
 */
async function findByPk(t = null, id) {
  return await Order.findByPk(
    id,
    {
      transaction: t,
      include: [
        { model: Partner, as: 'order_partner' },
        { model: Hotel, as: 'order_hotel' }
      ]
    }
  );
}

/**
 * 주문 정보를 ID로 업데이트
 * @param {import("sequelize").Transaction|null} t
 * @param {number} id
 * @param {Object} data
 * @returns {Promise<[number, import("../models/Order.js").Order[]]>}
 */
async function update(t = null, id, data) {
  return await Order.update(data, { where: { id }, transaction: t });
}

export default {
  create,
  findAll,
  findByPk,
  update,
};

// Repository (DB 중심)	HTTP Method
// 전체 목록 조회	findAll	GET
// 특정 조건 조회	findDailyOrders	GET (custom)
// 상세 데이터 조회	findByPk	GET
// 새 데이터 생성-저장	create POST
// 데이터 수정	update	PUT
// 데이터 삭제	destroy	DELETE