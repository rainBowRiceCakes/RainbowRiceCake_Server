/**
 * @file app/serivces/settlements.service.js
 * @description settlements Service
 * 260102 WOOK init
 */

import settlementRepository from '../repositories/settlement.repository.js';
import orderRepository from '../repositories/order.repository.js';

/**
 * 정산내역 상세 조회
 * @param {object} { page, limit, status, search }
 * @returns {Promise<{count: number, rows: Settlement[]}>}
 */
async function settlementShow({ page, limit, status, search }) {
    return await settlementRepository.findAllSettlements({ page, limit, status, search });
}

/**
 * 특정 월의 총 거래액
 * @param {object} data - { year, month }
 * @returns {Promise<number>}
 */
async function monthTotalAmount(data) {
  return await settlementRepository.monthTotalAmount(data)
}

/**
 * 특정 월의 통계 데이터 조회
 * @param {object} data - { year, month }
 * @returns {Promise<object>}
 */
async function getStatistics(data) {
    const [
        totalRevenue,
        totalOrderCount,
        activeRiderCount,
        paymentErrorCount
    ] = await Promise.all([
        settlementRepository.monthTotalAmount(data),
        orderRepository.countCompletedByMonth(data),
        settlementRepository.countActiveRidersByMonth(data),
        settlementRepository.countFailedOrPendingByMonth(data)
    ]);

    return {
        totalRevenue: totalRevenue || 0,
        totalOrderCount: totalOrderCount || 0,
        activeRiderCount: activeRiderCount || 0,
        paymentErrorCount: paymentErrorCount || 0,
    };
}

export default {
  monthTotalAmount,
  settlementShow,
  getStatistics,
}