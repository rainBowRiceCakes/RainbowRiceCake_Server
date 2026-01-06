/**
 * @file app/serivces/settlements.service.js
 * @description settlements Service
 * 260102 WOOK init
 */

import settlementRepository from '../repositories/settlement.repository.js';
import orderRepository from '../repositories/order.repository.js';
import riderRepository from '../repositories/rider.repository.js'; // riderRepository 추가
import db from '../models/index.js'; // 트랜잭션을 위해 db 모듈 임포트
import { executeSingleTransfer } from '../utils/toss/moneyTransfer.util.js'; // 송금 유틸리티 추가

/**
 * 정산내역 상세 조회 (목록용)
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
    const { year, month } = data;

    // 이전 달 계산
    const currentMonthDate = new Date(year, month - 1); // JS의 month는 0부터 시작하므로 -1
    const previousMonthDate = new Date(new Date(currentMonthDate).setMonth(currentMonthDate.getMonth() - 1));
    const prevMonthData = {
        year: previousMonthDate.getFullYear(),
        month: previousMonthDate.getMonth() + 1 // JS의 getMonth는 0부터 시작하므로 +1
    };

    const [
        totalRevenue,
        previousRevenue, // 이전 달 매출
        totalOrderCount,
        activeRiderCount,
        paymentErrorCount
    ] = await Promise.all([
        settlementRepository.monthTotalAmount(data),
        settlementRepository.monthTotalAmount(prevMonthData), // 이전 달 매출 조회
        orderRepository.countCompletedByMonth(data),
        settlementRepository.countActiveRidersByMonth(data),
        settlementRepository.countFailedOrPendingByMonth(data)
    ]);

    // MoM 계산
    let totalRevenueMoM = 0;
    const currentVal = totalRevenue || 0;
    const prevVal = previousRevenue || 0;

    if (prevVal > 0) {
        totalRevenueMoM = ((currentVal - prevVal) / prevVal) * 100;
    } else if (currentVal > 0) {
        // 이전 실적이 0일 때, 현재 실적이 있으면 100% 성장으로 처리
        totalRevenueMoM = 100;
    }
    
    // 소수점 1자리까지 반올림
    totalRevenueMoM = Math.round(totalRevenueMoM * 10) / 10;

    return {
        totalRevenue: currentVal,
        totalRevenueMoM, // MoM 필드 추가
        totalOrderCount: totalOrderCount || 0,
        activeRiderCount: activeRiderCount || 0,
        paymentErrorCount: paymentErrorCount || 0,
    };
}

/**
 * 최근 3개월 매출 합계
 * @returns {Promise<{labels: string[], data: number[]}>}
 */
async function lastThreeMonthsTotalAmount() {
    const now = new Date();
    const months = [];

    // 현재 달부터 이전 3개월간의 데이터를 준비
    for (let i = 2; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.push({
            year: d.getFullYear(),
            month: d.getMonth() + 1, // getMonth는 0부터 시작하므로 +1
            label: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        });
    }

    const totals = await Promise.all(
        months.map(m =>
            settlementRepository.monthTotalAmount({
                year: m.year,
                month: m.month
            })
        )
    );

    return {
        labels: months.map(m => m.label),
        data: totals.map(v => v || 0)
    };
}

/**
 * 정산 내역 상세 정보 조회
 * @param {object} { id }
 * @returns {Promise<Settlement>}
 */
async function getSettlementDetail({ id }) {
    return await settlementRepository.findByIdWithRiderDetails({ id });
}

/**
 * 거부된 정산 내역 재시도 및 즉시 송금 실행
 * @param {object} { id, bankAccount, bankCode, memo }
 * @returns {Promise<object>}
 */
async function retrySettlement({ id, bankAccount, bankCode, memo }) {
    // 1. DB 상태 업데이트 (은행 정보, 정산 상태 REJ -> REQ)
    const transaction = await db.sequelize.transaction();
    let settlement;
    try {
        settlement = await settlementRepository.findByIdWithRiderDetails({ id });

        if (!settlement) {
            throw new Error('정산 내역을 찾을 수 없습니다.');
        }
        if (settlement.status !== 'REJ') {
            throw new Error('거부된 상태의 정산만 재시도할 수 있습니다.');
        }

        if (bankAccount || bankCode) {
            const riderId = settlement.settlement_rider.id;
            const updateData = {};
            if (bankCode) updateData.bank = bankCode;
            if (bankAccount) updateData.bankNum = bankAccount;
            await riderRepository.update(transaction, riderId, updateData);
        }

        await settlementRepository.updateStatus({ id, status: 'REQ' }, transaction);

        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error; // DB 오류는 그대로 던짐
    }

    // 2. DB 업데이트 성공 후, 즉시 송금 시도
    try {
        const result = await executeSingleTransfer(settlement);
        return result; // 송금 성공 결과 반환
    } catch (error) {
        // executeSingleTransfer 내부에서 이미 상태를 REJ로 바꾸고 로그를 남김
        // 컨트롤러에게 송금 실패를 알리기 위해 에러를 다시 던짐
        throw new Error(`송금 실패: ${error.message}`);
    }
}

export default {
  monthTotalAmount,
  settlementShow,
  getStatistics,
  lastThreeMonthsTotalAmount,
  getSettlementDetail, // 새로 추가
  retrySettlement, // 새로 추가
}