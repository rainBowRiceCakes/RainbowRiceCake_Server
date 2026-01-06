/**
 * @file app/utils/toss/moneyTransfer.util.js
 * @description 정산액 송금 처리 유틸리티
 */

import db from "../../models/index.js";
import { transferMoney } from "./tossClient.js"; 
import { BANK_CODES } from "./bankCodes.js";
import { logger } from "../../middlewares/loggers/winston.logger.js";

const { Settlement, Rider, sequelize, User } = db;

/**
 * 단일 정산 건에 대한 송금 실행
 * @param {Settlement} settlementItem - 처리할 정산 객체
 */
export const executeSingleTransfer = async (settlementItem) => {
  const t = await sequelize.transaction();

  try {
    // 모델 인스턴스가 아닌 순수 객체일 수 있으므로, DB에서 최신 정보 다시 로드
    const item = await Settlement.findByPk(settlementItem.id, {
      include: [{
        model: Rider,
        as: 'settlement_rider',
        attributes: ['id', 'bank', 'bankNum'],
        required: true,
        include: [{
            model: User,
            as: 'rider_user',
            attributes: ['name'],
            required: true
        }]
      }],
      transaction: t
    });

    if (!item) {
      throw new Error(`[ID: ${settlementItem.id}] 정산 내역을 찾을 수 없습니다.`);
    }

    const rider = item.settlement_rider;
    if (!rider || !rider.bankNum) {
      throw new Error(`[ID: ${item.id}] 라이더 또는 계좌 정보가 유효하지 않습니다.`);
    }
    
    const bankCode = BANK_CODES[rider.bank];
    if (!bankCode) {
      throw new Error(`[ID: ${item.id}] 알 수 없는 은행명입니다: ${rider.bank}`);
    }

    const uniqueTransferId = `PAYOUT_${item.year}${item.month}_${rider.id}_${item.id}_${Date.now()}`;

    logger.info(`[이체 시도] Settlement ID ${item.id}: ${rider.rider_user.name}님에게 ${item.totalAmount}원...`);

    const result = await transferMoney({
        bankCode: bankCode,
        accountNumber: rider.bankNum,
        amount: item.totalAmount,
        orderId: uniqueTransferId
    });

    if (result.success) {
      await item.update({ 
        status: 'RES',
        memo: '지급 완료'
      }, { transaction: t });
      logger.info(`   -> [성공] Settlement ID ${item.id}`);
    } else {
      throw new Error(result.message || 'Toss API로부터 실패 응답을 받았습니다.');
    }

    await t.commit();
    return { success: true, message: '송금이 성공적으로 완료되었습니다.' };

  } catch (error) {
    await t.rollback();
    // 롤백 후 상태 업데이트를 위해 ID를 사용
    await Settlement.update({ 
      status: 'REJ',
      memo: error.message
    }, {
      where: { id: settlementItem.id }
    });
    logger.error(`[Transfer Error] Settlement ID ${settlementItem.id}: ${error.message}\n${error.stack}`);
    // 에러를 다시 던져서 호출 측에서 알 수 있도록 함
    throw error;
  }
};

/**
 * 대기 중인 모든 정산 건에 대한 송금 프로세스 실행 (스케줄러용)
 */
export const processSettlementTransfers = async () => {
  logger.info('[Batch Transfer] 시작: 모든 대기 중인 정산 건 처리');
  
  const pendingList = await Settlement.findAll({
    where: { status: 'REQ' }
  });

  if (pendingList.length === 0) {
    logger.info('[Batch Transfer] 완료: 처리할 정산 건이 없습니다.');
    return;
  }

  logger.info(`[Batch Transfer] 총 ${pendingList.length}건의 정산 처리 시작`);

  for (const item of pendingList) {
    try {
      await executeSingleTransfer(item);
    } catch (error) {
      // executeSingleTransfer 내부에서 이미 로깅 및 상태 업데이트가 이루어짐
      // 루프는 계속 진행하여 다른 정산 건에 영향을 주지 않음
      logger.error(`[Batch Transfer] Settlement ID ${item.id} 처리 중 오류가 발생했으나, 다음으로 넘어갑니다.`);
    }
  }

  logger.info('[Batch Transfer] 모든 정산 건 처리 완료.');
};
