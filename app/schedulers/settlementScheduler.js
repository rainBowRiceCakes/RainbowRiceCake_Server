import { Op } from "sequelize";
import db from "../models/index.js";
import { scheduleJob } from "node-schedule";

const { Order, Settlement, sequelize } = db;

// ★ 함수로 감싸서 export (initSettlementScheduler)
export const initSettlementScheduler = () => {
  const rule = '0 2 1 * *'; // 매월 1일 새벽 2시
  // const rule = '*/10 * * * * *'; // 테스트용

  scheduleJob(rule, async function() {
  console.log('[Scheduler] 라이더 월간 정산 시작...');
  const t = await sequelize.transaction();

  try {
    // 1. 날짜 범위 계산 (지난달)
    const now = new Date(); // 현재 1일
    // 지난달 1일
    const startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    // 이번달 1일의 1밀리초 전 (지난달 마지막 순간) -> 또는 between 검색을 위해 이번달 1일 사용
    const endDate = new Date(now.getFullYear(), now.getMonth(), 1); 

    const targetYear = startDate.getFullYear();
    const targetMonth = startDate.getMonth() + 1;

    console.log(`[Scheduler] 정산 대상: ${targetYear}년 ${targetMonth}월`);

    // 2. 라이더별 정산금액 집계 (GROUP BY)
    // SQL 예시: SELECT riderId, SUM(price * 0.8) as totalAmount FROM Orders WHERE ... GROUP BY riderId
    const settlementData = await Order.findAll({
      attributes: [
        'riderId',
        [sequelize.fn('SUM', sequelize.col('price')), 'totalPrice'] // 전체 매출 합계
      ],
      where: {
        status: 'com', // 배달 완료된 건만
        createdAt: {
          [Op.gte]: startDate, // >= 지난달 1일
          [Op.lt]: endDate     // < 이번달 1일
        },
        riderId: { [Op.ne]: null } // 라이더가 할당된 건만
      },
      group: ['riderId'],
      raw: true, // 순수 데이터 객체로 받기
      transaction: t
    });

    if (settlementData.length === 0) {
      console.log('[Scheduler] 정산할 내역이 없습니다.');
      await t.commit();
      return;
    }

    // 3. DB 저장용 데이터 가공 (수수료 80% 적용)
    const recordsToInsert = settlementData.map(data => ({
      riderId: data.riderId,
      year: targetYear,
      month: targetMonth,
      // price의 80% 계산 (소수점 버림 처리 예시)
      totalAmount: Math.floor(Number(data.totalPrice) * 0.8),
      status: 'REQ'
    }));

    // 4. 정산 테이블에 일괄 저장
    await Settlement.bulkCreate(recordsToInsert, { transaction: t });

    await t.commit();
    console.log(`[Scheduler] ${recordsToInsert.length}명의 라이더 정산 완료.`);

  } catch (error) {
    await t.rollback();
    console.error('[Scheduler] 정산 중 에러 발생:', error);
  }
  });
  console.log(`[Scheduler] Settlement job scheduled for: ${rule}`);
  
};