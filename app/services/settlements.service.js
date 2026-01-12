/**
 * @file app/serivces/settlements.service.js
 * @description settlements Service
 * 260102 WOOK init
 */

import settlementRepository from '../repositories/settlement.repository.js';
import orderRepository from '../repositories/order.repository.js';
import riderRepository from '../repositories/rider.repository.js'; // riderRepository 추가
import invoiceRepository from '../repositories/invoices.repository.js'; // invoiceRepository 추가
import db from '../models/index.js'; // 트랜잭션을 위해 db 모듈 임포트
import { executeSingleTransfer } from '../utils/toss/moneyTransfer.util.js'; // 송금 유틸리티 추가
import { cancelPayment, payWithBillingKey } from '../utils/portone/portone.v2.util.js';
import partnerRepository from '../repositories/partner.repository.js';

/**
 * 정산내역 상세 조회 (목록용, 클라이언트 페이지네이션용)
 * @param {object} { year, month }
 * @returns {Promise<Settlement[]>} - 해당 월의 모든 정산 내역
 */
async function settlementShow({ year, month }) {
    return await settlementRepository.findAllSettlements({ year, month });
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
    for (let i = 3; i >= 1; i--) {
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
    const transaction = await db.sequelize.transaction();
    let settlement;

    try {
        // 1. DB 상태 업데이트 (은행 정보, 정산 상태 REJ -> REQ)
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

        // 여기까지 성공하면 DB 변경사항을 커밋
        await transaction.commit();

        // 2. DB 커밋 성공 후, 즉시 송금 시도
        const result = await executeSingleTransfer(settlement);
        return result; // 송금 성공 결과 반환

    } catch (error) {
        // try 블록 내에서 DB 오류가 발생했는지, 송금 오류가 발생했는지에 따라 처리
        // 트랜잭션이 아직 완료(커밋 또는 롤백)되지 않았다면 롤백 실행
        if (transaction && !transaction.finished) {
            await transaction.rollback();
        }

        // 트랜잭션이 이미 커밋되었다면, 이는 송금 단계에서 에러가 발생한 것을 의미
        if (transaction.finished === 'commit') {
            // executeSingleTransfer에서 에러 발생 시, 해당 함수가 이미 보상 트랜잭션(상태 REJ로 변경)을 처리했다고 가정
            // 따라서 여기서는 송금 실패 에러만 전달
            throw new Error(`송금 실패: ${error.message}`);
        } else {
            // DB 처리 중 발생한 에러는 그대로 던짐
            throw error;
        }
    }
}

/**
 * 파트너의 특정 정산 건에 대해 자동 결제를 실행합니다. (autoPay)
 */
export const processSettlementAutoPay = async (id) => {
    // 1. 데이터 조회 (Repository 사용)
    const settlement = await invoiceRepository.findSettlementWithPartner(null, id);
    if (!settlement) {
        throw new Error(`ID ${id}에 해당하는 정산 내역이 없습니다.`);
    }

    if (!settlement.partnerSettlement_partner) {
        throw new Error("정산 내역에 연결된 파트너 정보가 없습니다. (조인 실패)");
    }

    if (!settlement.partnerSettlement_partner.billingKey) {
        throw new Error("해당 파트너에게 등록된 빌링키(billingKey)가 없습니다.");
    }

    try {
        // 2. 포트원 결제 API 호출
        const paymentResult = await payWithBillingKey({
            billingKey: settlement.partnerSettlement_partner.billingKey,
            amount: settlement.totalAmount,
            orderName: `${settlement.merchantUid} 정기 정산`,
            merchantUid: settlement.merchantUid,
            customerId: `USER_${settlement.partnerSettlement_partner.partner_user?.userId}`
        });

        const portonePaymentId = paymentResult.payment?.id || paymentResult.id || settlement.merchantUid;

        // 3. 결제 성공 시 DB 업데이트 (Repository 사용)
        await invoiceRepository.updateSettlementStatus(null, id, {
            status: 'PAID',
            paymentMethod: 'AUTO',
            paidAt: new Date(),
            impUid: portonePaymentId,
            failReason: null // ⭐ 성공했으므로 이전 실패 사유를 초기화합니다.
        });

        return { success: true, paymentId: portonePaymentId };

    } catch (error) {
        // 4. 결제 실패 시 사유 기록 (Repository 사용)
        await invoiceRepository.updateSettlementStatus(null, id, {
            status: 'FAILED',
            failReason: error.message
        });

        console.error(`[AutoPay Failed] Settlement ${id}:`, error.message);
        throw error;
    }
};

/**
 * 정산 결제 취소 로직
 */
export const cancelSettlementPayment = async (id, reason = "사용자 요청 취소") => {
    // 1. 레파지토리의 상세 조회 함수 사용 (빌링키 정보까지 한 번에 확인 가능)
    const settlement = await invoiceRepository.findSettlementWithPartner(null, id);

    if (!settlement) {
        throw new Error("정산 내역을 찾을 수 없습니다.");
    }

    if (settlement.status !== 'PAID') {
        throw new Error("결제 완료(PAID) 상태인 경우에만 취소가 가능합니다.");
    }

    try {
        // 2. 가짜 취소 API 호출 (util 함수 사용)
        const cancelResult = await cancelPayment({
            merchantUid: settlement.merchantUid, // DB 컬럼명 확인 필요
            reason: reason
        });

        // 3. 레파지토리의 업데이트 함수 사용
        await invoiceRepository.updateSettlementStatus(null, id, {
            status: 'CANCEL',
            failReason: `취소 완료: ${reason}` // 성공 시에는 사유를 성공 메시지로 교체
        });

        return {
            success: true,
            cancellationId: cancelResult.cancellation.id,
            msg: "결제 취소가 정상적으로 완료되었습니다."
        };

    } catch (error) {
        console.error(`[Cancel Failed] Settlement ${id}:`, error.message);

        // 취소 시도 중 에러가 발생하면 상태를 유지하거나 기록
        throw new Error(`취소 처리 중 오류가 발생했습니다: ${error.message}`);
    }
};

/**
 * [Batch] 미결제 정산 내역 일괄 자동 결제 로직
 * 스케줄러나 관리자 페이지에서 호출할 수 있도록 독립적으로 구성합니다.
 */
export const processBatchAutoPay = async () => {
    console.log('--- [Batch Service] 자동결제 배치 시작 ---');

    try {
        // 1. 레파지토리 함수를 통해 대상 조회
        const targetSettlements = await invoiceRepository.findSettlementsForAutoPay();

        if (targetSettlements.length === 0) {
            console.log('[Batch] 자동결제 대상이 없습니다.');
            return { successCount: 0, totalCount: 0 };
        }

        let successCount = 0;

        // 2. 루프 실행
        for (const settlement of targetSettlements) {
            try {
                // 개별 결제 로직 호출
                await processSettlementAutoPay(settlement.id);
                successCount++;
            } catch (err) {
                console.error(`[Batch Fail] 정산ID ${settlement.id}: ${err.message}`);
            }
        }

        return { successCount, totalCount: targetSettlements.length };
    } catch (error) {
        console.error('[Batch Error] 배치 프로세스 에러:', error);
        throw error;
    }
};

export default {
    monthTotalAmount,
    settlementShow,
    getStatistics,
    lastThreeMonthsTotalAmount,
    getSettlementDetail, // 새로 추가
    retrySettlement, // 새로 추가
    processSettlementAutoPay, // 파트너 자동결제 관련 새로 추가 (26.01.11 송보미)
    cancelSettlementPayment, // 정산 결제 취소 관련 새로 추가 (26.01.11 송보미)
    processBatchAutoPay, // 자동 결제 배치 함수 완성 (26.01.11 송보미)
}