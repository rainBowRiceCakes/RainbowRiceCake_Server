/**
 * @file app/repositories/settlement.repository.js
 * @description Settlement Repository
 * 260102 v1.0.0 wook 초기 생성
 */

import { Op } from 'sequelize';
import db from '../models/index.js';

const { Settlement, Rider, User } = db;

/**
 * 정산내역 상세 조회
 * @param {object} { page, limit, status, search }
 * @returns {Promise<{count: number, rows: Settlement[]}>}
 */
async function findAllSettlements({ page, limit, status, search }) {
    const offset = (page - 1) * limit;

    const where = {};
    if (status) {
        where.status = status;
    }
    if (search) {
        where[Op.or] = [
            { '$settlement_rider.rider_user.name$': { [Op.like]: `%${search}%` } },
        ];
    }

    return await Settlement.findAndCountAll({
        where,
        include: [
            {
                model: Rider,
                as: 'settlement_rider',
                include: [{
                    model: User,
                    as: 'rider_user',
                    attributes: ['name']
                }]
            }
        ],
        offset,
        limit,
        order: [['createdAt', 'DESC']],
        distinct: true,
    });
}

/**
 * 특정 월의 총 정산액 합계
 * @param {object} { year, month }
 * @param {import("sequelize").Transaction} t 
 * @returns {Promise<number>}
 */
async function monthTotalAmount({ year, month }, t = null) {
  const where = {};
  if (year) where.year = year;
  if (month) where.month = month;

  return await Settlement.sum(
      'totalAmount',
    {
      where,
      transaction: t
    }
  );
}

/**
 * 특정 월의 활성 기사 수 (중복 제거)
 * @param {object} { year, month }
 * @returns {Promise<number>}
 */
async function countActiveRidersByMonth({ year, month }) {
    const where = {};
    if (year) where.year = year;
    if (month) where.month = month;

    return await Settlement.count({
        where,
        distinct: true,
        col: 'rider_id' // RiderId 대신 실제 DB 컬럼명 사용
    });
}

/**
 * 특정 월의 지급 실패/대기 건수
 * @param {object} { year, month }
 * @returns {Promise<number>}
 */
async function countFailedOrPendingByMonth({ year, month }) {
    const where = {
        status: {
            [Op.ne]: 'COM' // 'COM'이 아닌 상태
        }
    };
    if (year) where.year = year;
    if (month) where.month = month;

    return await Settlement.count({ where });
}

export default {
  findAllSettlements,
  monthTotalAmount,
  countActiveRidersByMonth,
  countFailedOrPendingByMonth,
}