/**
 * @file app/utils/toss/moneyTransfer.util.js
 * @description 정산액 송금 처리 유틸리티
 */

import db from "../../models/index.js";
import { transferMoney } from "./tossClient.js"; 
import { BANK_CODES } from "./bankCodes.js";
import { logger } from "../../middlewares/loggers/winston.logger.js";
import invoicesService from "../../services/invoices.service.js";

const { Settlement, Rider, sequelize, User } = db;

/**
 * 단일 정산 건에 대한 송금 실행
 * @param {Settlement} settlementItem - 처리할 정산 객체
 */
export const executeSingleTransfer = async (settlementItem) => {
  const t = await sequelize.transaction();
  let item; // Declare item here to make it accessible in catch

  try {
    // 모델 인스턴스가 아닌 순수 객체일 수 있으므로, DB에서 최신 정보 다시 로드
    item = await Settlement.findByPk(settlementItem.id, { // assign to item
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

    if (!result.success) {
      throw new Error(result.message || 'Toss API로부터 실패 응답을 받았습니다.');
    }
    // --- 송금 API 성공 후, 송장 처리 및 DB 상태 업데이트 ---

    // 1. 송장 처리를 먼저 실행 (아직 status가 RES가 아니므로 스킵되지 않음)
    try {
      // riderProcessAndSendInvoice는 { riderId, year, month, status } 객체를 기대함.
      // settlementItem.status는 원래 상태 (예: REQ 또는 REJ)
      await invoicesService.riderProcessAndSendInvoice({
        riderId: item.riderId,
        year: item.year,
        month: item.month,
        status: settlementItem.status // 송장 처리는 원래 상태를 기준으로 해야 함
      });
    } catch (invoiceError) {
      logger.error(`[Invoice Error] Settlement ID ${item.id} 송장 처리 실패: ${invoiceError.message}\n${invoiceError.stack}`);
      // 송장 처리 실패가 송금 자체를 롤백시키지는 않으므로 에러를 재던지지 않음.
    }

    // 2. 송장 처리 후, 정산 상태를 RES로 업데이트
    await item.update({ 
      status: 'RES'
    }, { transaction: t });
    logger.info(`   -> [성공] Settlement ID ${item.id}`);

    // 3. 모든 DB 변경사항을 커밋
    await t.commit();
    
    return { success: true, message: '송금이 성공적으로 완료되었습니다.' };

  } catch (error) {
    // 트랜잭션이 아직 활성화 상태라면 롤백
    if (t && !t.finished) {
      await t.rollback();
    }
    // 송금 실패 시 정산 상태를 REJ로 업데이트 (보상 트랜잭션)
    // item이 정의되지 않은 상태일 수도 있으므로 settlementItem.id 사용
    await Settlement.update({ 
      status: 'REJ',
      memo: error.message
    }, {
      where: { id: settlementItem.id }
    });
    logger.error(`[Transfer Error] Settlement ID ${settlementItem.id}: ${error.message}\n${error.stack}`);
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
