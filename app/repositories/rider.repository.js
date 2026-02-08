/**
 * @file app/repositories/rider.repository.js
 * @description rider Repository
 * 251223 v1.0.0 wook init
 */

import { Op } from 'sequelize';
import db from '../models/index.js';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

// dayjs 플러그인 설정
dayjs.extend(utc);
dayjs.extend(timezone);

const KST = "Asia/Seoul";

const { Rider, User, Settlement, Order } = db;


// --- 1. MY PROFILE WORKFLOW FOR RIDERS (기사와 관련된 profile 불러오기 & 업데이트) ---
/**
 * userId로 기사 정보 조회 (기사 본인 정보 조회용)
 * @param {import("sequelize").Transaction|null} t
 * @param {number} userId - 유저 ID
 * @returns {Promise<import("../models/Partner.js").Partner|null>}
 */
async function findByUserId(t = null, userId) {
  return await Rider.findOne({
    where: { userId },
    include: [
      {
        model: User,
        as: 'rider_user',
        attributes: ['id', 'name', 'email']
      }
    ],
    transaction: t
  });
}

/**
 * 기사 본인 정보 자기가 수정
 * @param {import("sequelize").Transaction|null} t
 * @param {number} riderId - 라이더 ID
 * @param {object} updateData - 수정할 데이터
 * @returns {Promise<[number]>} - 수정된 행의 개수
 */
async function update(t = null, riderId, updateData) {
  return await Rider.update(
    updateData,
    {
      where: { id: riderId },
      transaction: t
    }
  );
}

// -------------------------------------------------------------------------------------------

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
          attributes: ['name', 'email'],
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
 * @param {{limit: number, offset: number, status: string, search: string}} data
 * @returns {Promise<Array<import("../models/Rider.js").Rider>>}
 */
async function riderShow(t = null, { limit, offset, status, search }) {
  const where = {};
  if (status) {
    where.status = status;
  }

  const include = [
    {
      attributes: ['name'],
      model: User,
      as: 'rider_user',
    }
  ];

  if (search) {
    include[0].where = {
      name: { [Op.like]: `%${search}%` }
    };
  }

  return await Rider.findAndCountAll(
    {
      where,
      include,
      limit,
      offset,
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

/**
 * PK로 데이터 삭제
 */
async function riderDelete(t = null, id) {
  return await Rider.destroy({
    where: {
      id: id
    }
  },
    {
      transaction: t
    });
}

/**
 * 유저ID로 데이터 삭제
 */
async function riderDeleteUser(t = null, id) {
  return await Rider.destroy({
    where: {
      userId: id
    }
  },
    {
      transaction: t
    });
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

/**
 * 라이더 출퇴근 상태 업데이트
 */
async function updateWorkStatus(t = null, riderId, isWorking) {
  return await Rider.update(
    {
      isWorking,
    },
    {
      where: { id: riderId },
      transaction: t
    }
  );
}

/**
 * 라이더 정산 내역 조회
 */
async function getSettlementByRider(t = null, riderId) {
  // 사용자가 보낸 이미지의 테이블 구조를 바탕으로 구현
  return await Settlement.findAll({
    where: {
      riderId: riderId, // 기사 PK와 연결된 외래키
    },
    attributes: [
      'id',
      'total_amount', // 총 정산금
      'status',       // 상태 (REQ, COM, REJ)
      'year',         // 정산년도
      'month'         // 정산월
    ],
    order: [
      ['year', 'DESC'], // 최신 연도순
      ['month', 'DESC'] // 최신 월순
    ],
    transaction: t // 전달받은 트랜잭션 적용
  });
}

/**
 * 정산 ID로 정산 기간 조회
 */
async function findSettlementById(transaction, id) {
  return await Settlement.findOne({
    where: { id: id },
    attributes: ['year', 'month'], // 기간 정보만 필요
    transaction
  });
}

/**
 * 기간별 주문 조회
 */
async function getOrdersByPeriod(transaction, riderId, year, month) {
  const baseDate = dayjs().tz(KST).year(year).month(month - 1).date(1);

  const startDate = baseDate.startOf('month').toDate(); // 예: 2025-12-01 00:00:00
  const endDate = baseDate.endOf('month').toDate();     // 예: 2025-12-31 23:59:59

  // ✅ 2. DB 조회 (ERD 컬럼명 반영: price, order_code, updated_at)
  return await Order.findAll({
    where: {
      riderId: riderId,
      status: 'com', // 배송 완료 상태만
      updatedAt: {
        [Op.between]: [startDate, endDate]
      }
    },
    attributes: [
      'id',
      'orderCode', // ERD: order_code
      'updatedAt', // ERD: 배송 완료 시간 기준
      'price'      // ERD: 배송요금(기사 정산금)
    ],
    transaction
  });
}

export default {
  findByUserId,
  update,
  findByPk,
  riderShow,
  create,
  riderDelete,
  riderDeleteUser,
  updatePickupAt,
  updateWorkStatus,
  getSettlementByRider,
  findSettlementById,
  getOrdersByPeriod
};
