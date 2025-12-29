/**
 * @file app/repositories/order.repository.js
 * @description Order Repository (주문 등록, 주문 목록 조회, 주문 상세 조회)
 * 251223 v1.0.0 BSONG init
 * 251225 v1.1.0 BSONG update - 상태별 주문 목록 및 카운트 조회 기능 추가, 그리고 주문 히스토리 상세 조회 기능 추가
*/

import { Op } from 'sequelize';
import db from '../models/index.js';
const { Order, Partner, Hotel, Rider, Sequelize, User } = db;

/**
 * 주문 생성
 */
async function create(t = null, data) {
  return await Order.create(data, { transaction: t });
}

/**
 * 주문 존재 여부 확인
 */
async function existsByPk(t = null, orderId) {
  const count = await Order.count({
    where: { id: orderId },
    transaction: t
  });
  return count > 0;
}

/**
 * 기본 조회 (조인 없음)
 */
async function findByPk(t = null, id) {
  return await Order.findByPk(id, {
    transaction: t
  });
}

/**
 * 상세 조회 (조인 포함)
 */
async function findByPkWithDetails(t = null, id) {
  return await Order.findByPk(id, {
    transaction: t,
    include: [
      {
        model: Partner,
        as: 'order_partner',
        attributes: [
          'id', 'userId', 'krName', 'enName',
          'manager', 'phone', 'address'
        ]
      },
      {
        model: Hotel,
        as: 'order_hotel',
        attributes: [
          'id', 'krName', 'enName',
          'manager', 'phone', 'address'
        ]
      },
      {
        model: Rider,
        as: 'order_rider',
        attributes: ['id', 'phone'],
        required: false,
        include: [
        {
          attributes: ['name'],
          model: User,
          as: 'rider_user',
        }
      ],
      }
    ]
  });
}

/**
 * 라이더의 진행중인 주문 개수 조회
 */
async function countInProgressByRider(t = null, riderId) {
  return await Order.count({
    where: {
      riderId,
      status: { [Op.in]: ['match', 'pick'] }
    },
    transaction: t
  });
}

/**
 * 주문을 매칭 상태로 업데이트
 */
async function updateToMatched(t = null, orderId, riderId) {
  return await Order.update(
    {
      riderId,
      status: 'match',
      matchedAt: new Date()
    },
    {
      where: { id: orderId },
      transaction: t
    }
  );
}

/**
 * 주문을 픽업 상태로 업데이트
 */
async function updateToPicked(t = null, orderId) {
  return await Order.update(
    {
      status: 'pick',
      pickedAt: new Date()
    },
    {
      where: { id: orderId },
      transaction: t
    }
  );
}

/**
 * 주문을 완료 상태로 업데이트
 */
async function updateToCompleted(t = null, orderId) {
  return await Order.update(
    {
      status: 'com',
      completedAt: new Date()
    },
    {
      where: { id: orderId },
      transaction: t
    }
  );
}

/**
 * 오늘 주문을 탭별로 조회
 */
async function findTodayOrdersByTab(t = null, { filter, statuses, today, limit, offset }) {
  return await Order.findAndCountAll({
    where: {
      ...filter,
      createdAt: { [Op.between]: [today.start, today.end] },
      status: { [Op.in]: statuses }
    },
    limit,
    offset,
    order: [['createdAt', 'DESC']],
    transaction: t,
    include: [
      {
        model: Partner,
        as: 'order_partner',
        attributes: ['id', 'krName', 'address'],
        required: true
      },
      {
        model: Hotel,
        as: 'order_hotel',
        attributes: ['id', 'krName', 'address'],
        required: true
      },
      {
        model: Rider,
        as: 'order_rider',
        attributes: ['id', 'name', 'phone'],
        required: false
      }
    ],
    attributes: [
      'id', 'status', 'price', 'cntS', 'cntM', 'cntL',
      'createdAt', 'matchedAt', 'pickedAt', 'completedAt'
    ]
  });
}

/**
 * 주문 히스토리 조회
 */
async function findOrderHistory(t = null, { filter, status, dateRange, limit, offset }) {
  const where = { ...filter };

  if (status) {
    where.status = status;
  }

  if (dateRange) {
    where.createdAt = {
      [Op.between]: [dateRange.start, dateRange.end]
    };
  }

  return await Order.findAndCountAll({
    where,
    limit,
    offset,
    order: [['createdAt', 'DESC']],
    transaction: t,
    include: [
      {
        model: Partner,
        as: 'order_partner',
        attributes: ['id', 'krName', 'address'],
        required: true
      },
      {
        model: Hotel,
        as: 'order_hotel',
        attributes: ['id', 'krName', 'address'],
        required: true
      },
      {
        model: Rider,
        as: 'order_rider',
        attributes: ['id', 'name'],
        required: false
      }
    ],
    attributes: [
      'id', 'status', 'price', 'cntS', 'cntM', 'cntL', 'createdAt'
    ]
  });
}

/**
 * 상태별 통계 조회
 */
async function getStatusStats(t = null, filter = {}) {
  return await Order.findAll({
    where: filter,
    attributes: [
      'status',
      [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
    ],
    group: ['status'],
    transaction: t,
    raw: true
  });
}

/**
 * 주문 히스토리 조회
 */
async function findOrderHistoryThreeMonth(t = null, { dateRange, limit, offset }) {
  const where = {};

  if (dateRange) {
    where.createdAt = {
      [Op.between]: [dateRange.start, dateRange.end]
    };
  }

  return await Order.findAndCountAll({
    where,
    limit,
    offset,
    order: [['createdAt', 'DESC']],
    transaction: t,
    include: [
      {
        model: Partner,
        as: 'order_partner',
        attributes: ['id', 'krName', 'address'],
        required: true
      },
      {
        model: Hotel,
        as: 'order_hotel',
        attributes: ['id', 'krName', 'address'],
        required: true
      },
      {
        model: Rider,
        as: 'order_rider',
        attributes: ['id'],
        required: false,
        include: [
          {
            model: User,
            as: 'rider_user',
            attributes: ['name'],
            required: true
          }
        ]
      }
    ],
    attributes: [
      'id', 'status', 'price', 'cntS', 'cntM', 'cntL', 'createdAt'
    ]
  });
}

export default {
  create,
  existsByPk,
  findByPk,
  findByPkWithDetails,
  countInProgressByRider,
  updateToMatched,
  updateToPicked,
  updateToCompleted,
  findTodayOrdersByTab,
  findOrderHistory,
  getStatusStats,
  findOrderHistoryThreeMonth,
};

// Repository (DB 중심)	HTTP Method
// 전체 목록 조회	findAll	GET
// 특정 조건 조회	findDailyOrders	GET (custom)
// 상세 데이터 조회	findByPk	GET
// 새 데이터 생성-저장	create POST
// 데이터 수정	update	PUT
// 데이터 삭제	destroy	DELETE
