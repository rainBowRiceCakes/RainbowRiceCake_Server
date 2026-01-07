/**
 * @file app/repositories/order.repository.js
 * @description Order Repository (주문 등록, 주문 목록 조회, 주문 상세 조회)
 * 251223 v1.0.0 BSONG init
 * 251225 v1.1.0 BSONG update - 상태별 주문 목록 및 카운트 조회 기능 추가, 그리고 주문 히스토리 상세 조회 기능 추가
 * 260106 v1.2.0 sara update - 객체 분해 할당 적용 및 불필요한 주석 제거, findOrdersList attributes 수정
*/

import { Op } from 'sequelize';
import db from '../models/index.js';
const { Order, Partner, Hotel, Rider, sequelize, User, Image } = db;

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
async function findByOrderCodeWithDetails(t = null, orderCode) {
  return await Order.findOne({
    where: { orderCode: orderCode },
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
      riderId: riderId,
      status: 'mat',
      updatedAt: new Date()
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
      pickupAt: new Date()
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
      updatedAt: new Date()
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
      'id', 'orderCode', 'status', 'price', 'cntS', 'cntM', 'cntL',
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
        attributes: ['id'],
        required: false,
        include: [
          {
            model: User,
            as: 'rider_user',
            attributes: ['name'],
            required: false
          }
        ]
      }
    ],
    attributes: [
      'id', 'orderCode', 'status', 'price', 'cntS', 'cntM', 'cntL', 'createdAt'
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
      [sequelize.fn('COUNT', sequelize.col('id')), 'count']
    ],
    group: ['status'],
    transaction: t,
    raw: true
  });
}

/**
 * 주문 PK로만 상세 정보 조회
 * @param {import('sequelize').Transaction} t - 트랜잭션 객체
 * @param {number} dlvId - 주문 PK (dlvId)
 */
async function findByIdOnly(t = null, dlvId) {
  return await Order.findByPk(dlvId, {
    transaction: t,
    include: [
      {
        model: Hotel,
        as: 'order_hotel', // Order.js의 associate 설정 참조
        attributes: ['id', 'kr_name', 'en_name', 'address'], // 호텔 이름과 주소 포함
        required: true
      },
      {
        model: Rider,
        as: 'order_rider', // Order.js의 associate 설정 참조
        attributes: ['id', 'phone'], // 기사 연락처 포함
        required: false // 배차 전일 수 있으므로 false
      },
      {
        model: Partner,
        as: 'order_partner', // Order.js의 associate 설정 참조
        attributes: ['id', 'kr_name', 'en_name', 'address'], // 호텔 이름과 주소 포함
        required: true
      }
    ]
  });
}

/**
 * 주문 히스토리 조회
 */
async function findOrderHistoryThreeMonth(t = null, { dateRange, limit, offset, where = {} }) {
  // 깊은 복사를 사용하여 where 객체를 변경하지 않고 새로운 객체 생성
  const conditions = { ...where };

  if (dateRange && dateRange.start && dateRange.end) {
    conditions.createdAt = {
      [Op.between]: [dateRange.start, dateRange.end]
    };
  }

  // statusExclude는 이제 service 단에서 where 객체로 통합되어 넘어오므로, 
  // 여기서 별도로 처리하지 않고 그대로 conditions에 포함된 것을 사용합니다.
  // 만약 service 단에서 statusExclude가 where.status에 Op.ne로 명시되지 않고 
  // 여기서만 처리해야 한다면 아래 코드를 활성화 합니다.
  // if (statusExclude) {
  //   conditions.status = { ...conditions.status, [Op.ne]: statusExclude };
  // }

  return await Order.findAndCountAll({
    where: conditions, // 병합된 조건을 사용
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
      'id', 'orderCode', 'status', 'price', 'cntS', 'cntM', 'cntL', 'createdAt'
    ]
  });
}

async function orderDelete(t = null, id) {
  return await Order.destroy({ where: { id: id } }, { transaction: t })
}

// ------------------------------------------ 2026.01.01 추가
async function findOrdersList(t = null, { where, limit, offset }) {
  return await Order.findAndCountAll({
    where,
    limit,
    offset,
    distinct: true,
    order: [['createdAt', 'DESC']],
    transaction: t,
    include: [
      {
        model: Partner,
        as: 'order_partner',
        attributes: ['id', 'krName', 'enName', 'address'], // enName 추가 from sara
        required: true
      },
      {
        model: Hotel,
        as: 'order_hotel',
        attributes: ['id', 'krName', 'enName', 'address'], // enName 추가 from sara
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
            required: false
          }
        ]
      },
      {
        model: Image,
        as: 'order_image',
        attributes: ['img', 'type'],
        required: false
      }
    ],
    attributes: [
      'id', 'orderCode', 'status', 'name', 'price', 'cntS', 'cntM', 'cntL', 'createdAt', 'updatedAt'
    ]
  });
}

// 대시보드 통계용: 최근 N일간 일별 주문 건수 조회
async function getDailyOrderCounts(days = 7) {
  return await Order.findAll({
    attributes: [
      [db.sequelize.literal("DATE_FORMAT(created_at, '%Y-%m-%d')"), 'date'],
      [db.sequelize.literal("COUNT(id)"), 'count']
    ],
    where: {
      created_at: {
        [Op.gte]: db.sequelize.literal(`DATE_SUB(NOW(), INTERVAL ${days} DAY)`)
      }
    },
    group: [db.sequelize.literal("DATE_FORMAT(created_at, '%Y-%m-%d')")],
    order: [[db.sequelize.literal('date'), 'ASC']],
    raw: true
  });
}

// 대시보드 통계용: 특정 월의 완료된 주문 건수
async function countCompletedByMonth({ year, month }) {
  // 월의 시작일과 종료일 계산
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59, 999);
  return await Order.count({
    where: {
      // status: 'com',
      createdAt: {
        [Op.between]: [startDate, endDate]
      }
    }
  });
}

// [대시보드 요약] 3가지 핵심 지표 카운트
async function getDashboardSummary(t = null, { start, end }) {
  // 오늘의 배송 요청: 생성일(createdAt)이 오늘인 것
  const todayRequests = await Order.count({
    where: {
      created_at: { [Op.between]: [start, end] }
    },
    transaction: t
  });

  // 진행 중 배송: 현재 상태가 'pick'인 것 전체 (날짜 무관)
  const inProgress = await Order.count({
    where: {
      status: 'pick'
    },
    transaction: t
  });

  // 오늘의 완료 배송: 상태가 'com'이고 완료일(updatedAt)이 오늘인 것
  const todayCompleted = await Order.count({
    where: {
      status: 'com',
      updated_at: { [Op.between]: [start, end] }
    },
    transaction: t
  });

  return { todayRequests, inProgress, todayCompleted };
}

// [긴급 주문 현황]
async function findUrgentOrders(t = null) {
  // 1시간 전 시간 계산
  const oneHourAgo = new Date();
  oneHourAgo.setHours(oneHourAgo.getHours() - 1);

  return await Order.findAll({
    where: {
      status: 'req',
      createdAt: {
        [Op.lt]: oneHourAgo // less than (<) 1시간 전
      }
    },
    limit: 5,
    order: [['createdAt', 'ASC']], // 가장 오래된(급한) 주문부터 표시
    transaction: t,
    include: [
      {
        model: Partner,
        as: 'order_partner',
        attributes: ['krName']
      },
      {
        model: Hotel,
        as: 'order_hotel',
        attributes: ['krName']
      },
    ],
    attributes: [
      'id', 'orderCode', 'status', 'createdAt',
    ]
  });
}

/**
 * 이메일로 주문을 모두 찾아옴(서비스에서 배송, 문의를 둘다 가져오는 것 중에 배송을 가져오는 역할을 맏은 친구)
 * @param {import("sequelize").Transaction} t
 * @param {object} param
 * @param {string} param.name
 * @param {string} param.email
 * @returns {Promise<Array<{status: string, count: number}>>}
 */
async function findOrdersByEmail(t = null, { email }) {
  return await Order.findAll({
    where: { email },
    include: [
      {
        model: Rider,
        as: 'order_rider',
        required: false,
        include: [
          {
            model: User,
            as: 'rider_user',
            attributes: ['name'],
            required: false
          }
        ]
      },
      {
        model: Hotel,
        as: 'order_hotel',
        attributes: ['krName', 'enName'],
        required: false,
      },
      {
        model: Partner,
        as: 'order_partner',
        attributes: ['krName', 'enName'],
        required: false,
      },
      {
        model: Image,
        as: 'order_image',
        attributes: ['img', 'type'],
        required: false,
      },
    ],
    transaction: t,
  })
}

// ------------------------------------------ 2026.01.06 추가
async function findByOrderCode(t = null, orderCode) {
  const order = await Order.findOne({
    where: { orderCode },
    include: [
      {
        model: Partner,
        as: 'order_partner',
        attributes: ['id', 'phone', 'krName', 'enName', 'address', 'lat', 'lng'],
        required: false
      },
      {
        model: Hotel,
        as: 'order_hotel',
        attributes: ['id', 'phone', 'krName', 'enName', 'address', 'lat', 'lng'],
        required: false
      },
      {
        model: Rider,
        as: 'order_rider',
        attributes: ['id', 'phone'],
        required: false,
        include: [
          {
            model: User,
            as: 'rider_user',
            attributes: ['name', 'id', 'email'],
            required: false
          }
        ]
      },
    ],
    transaction: t,
  });
  return order;
}

/**
 * 픽업 시간 업데이트
 */
async function updatePickupAt(t = null, riderId) {
  return await Rider.update(
    {
      pickupAt: new Date()
    },
    {
      where: { id: riderId },
      transaction: t
    }
  );
}

export default {
  create,
  existsByPk,
  findByPk,
  findByOrderCodeWithDetails,
  findByIdOnly,
  countInProgressByRider,
  updateToMatched,
  updateToPicked,
  updateToCompleted,
  findTodayOrdersByTab,
  findOrderHistory,
  getStatusStats,
  findOrderHistoryThreeMonth,
  orderDelete,
  findOrdersList,
  countCompletedByMonth,
  getDailyOrderCounts,
  getDashboardSummary,
  findUrgentOrders,
  findOrdersByEmail,
  findByOrderCode,
  updatePickupAt,
};

// Repository (DB 중심)	HTTP Method
// 전체 목록 조회	findAll	GET
// 특정 조건 조회	findDailyOrders	GET (custom)
// 상세 데이터 조회	findByPk	GET
// 새 데이터 생성-저장	create POST
// 데이터 수정	update	PUT
// 데이터 삭제	destroy	DELETE
