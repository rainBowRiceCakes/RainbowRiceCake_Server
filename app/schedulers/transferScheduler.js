/**
 * @file app/schedulers/transferScheduler.js
 * @description 매월 자동 정산 메일 발송 스케줄러
 */

import { scheduleJob } from "node-schedule";
import db from "../models/index.js"; // app/models/index.js 에서 가져옴

// ★ 방금 만든 utils 파일들을 import (경로 주의: ../utils/...)
import { transferMoney } from "../utils/toss/tossClient.js"; 
import { BANK_CODES } from "../utils/toss/bankCodes.js";

const { Settlement, Rider, sequelize, User } = db;

export const initTransferScheduler = () => {
  const rule = '* 10 10 * * *'; // (매월 10일 오전10시)
//   const rule = '*/30 * * * * *'; (테스트용 30초마다 실행)

  scheduleJob(rule, async function() {
    console.log('[Transfer Scheduler] 송금 프로세스 시작...');
    
    // 1. 지급 요청(REQ) 상태 조회
    const pendingList = await Settlement.findAll({
      where: { status: 'REQ' },
      include: [{
        model: Rider,
        as: 'settlement_rider',
        attributes: ['id', 'bank', 'bankNum'],
        required: false
        ,include: [{
            model: User,
            as: 'rider_user',
            attributes: ['name'],
            required: false
        }]
      }]
    });

    if (pendingList.length === 0) {
      console.log('[Transfer Scheduler] 이체할 대상이 없습니다.');
      return;
    }

    // 2. 이체 실행
    for (const item of pendingList) {
      const t = await sequelize.transaction();

      try {
        const rider = item.settlement_rider;

        if (!rider || !rider.bankNum) throw new Error('계좌 정보 없음');
        
        const bankCode = BANK_CODES[rider.bank];
        if (!bankCode) throw new Error(`알 수 없는 은행명: ${rider.bank}`);

        const uniqueTransferId = `PAYOUT_${item.year}${item.month}_${rider.id}_${item.id}`;

        console.log(`[이체 시도] ${rider.rider_user.name}님에게 ${item.totalAmount}원...`);

        // API 호출
        console.log(bankCode, rider.bankNum, item.totalAmount, uniqueTransferId, '@@@@@@@@@@@@@@@@@')
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
          console.log(`   -> [성공]`);
        } else {
          throw new Error(result.message);
        }

        await t.commit();

      } catch (error) {
        await t.rollback();
        await item.update({ status: 'REJ' });
        console.error(`   -> [실패] ${error.message}`);
      }
    }
  });
  console.log(`[Scheduler] Transfer job registered: ${rule}`);
};