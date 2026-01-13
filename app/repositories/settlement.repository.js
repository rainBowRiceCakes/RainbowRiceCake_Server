/**
 * @file app/repositories/settlement.repository.js
 * @description Settlement Repository
 * 260102 v1.0.0 wook 초기 생성
 */

import { Op } from 'sequelize';
import db from '../models/index.js';

const { Settlement, Rider, User } = db;

/**
 * 정산내역 상세 조회 (클라이언트 페이지네이션용)
 * @param {object} { year, month }
 * @returns {Promise<Settlement[]>} - 해당 월의 모든 정산 내역
 */
async function findAllSettlements({ year, month }) {
    const where = {};
    // year와 month를 필터링 조건으로 추가
    if (year) {
        where.year = year;
    }
    if (month) {
        where.month = month;
    }
    return await Settlement.findAll({ // findAndCountAll 대신 findAll 사용
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
        order: [['id', 'DESC']],
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
        status: 'REJ'
    };
    if (year) where.year = year;
    if (month) where.month = month;

    return await Settlement.count({ where });
}

/**
 * ID로 정산 내역 및 라이더 상세 정보 조회
 * @param {object} { id }
 * @returns {Promise<Settlement>}
 */
async function findByIdWithRiderDetails({ id }) {
    return await Settlement.findOne({
        where: { id },
        include: [
            {
                model: Rider,
                as: 'settlement_rider',
                attributes: ['id', 'bank', 'bankNum', 'address', 'phone'], // Rider 모델의 필요한 정보 포함
                include: [{
                    model: User,
                    as: 'rider_user',
                    attributes: ['id', 'name', 'email'] // User 모델의 필요한 정보 포함
                }]
            }
        ],
    });
}

/**
 * 정산 내역의 상태 업데이트
 * @param {object} { id, status }
 * @param {import("sequelize").Transaction} transaction
 * @returns {Promise<[number, Settlement[]]>}
 */
async function updateStatus({ id, status }, transaction) {
    return await Settlement.update(
        { status },
        {
            where: { id },
            transaction,
        }
    );
}

export default {
  findAllSettlements,
  monthTotalAmount,
  countActiveRidersByMonth,
  countFailedOrPendingByMonth,
  findByIdWithRiderDetails,
  updateStatus,
}