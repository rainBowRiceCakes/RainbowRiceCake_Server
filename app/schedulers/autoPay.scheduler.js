/**
 * @file app/schedulers/autoPayScheduler.js
 * @description 매월 1일 새벽 3시, 파트너 빌링키 자동 결제 실행
 */
import { scheduleJob } from "node-schedule";
import settlementsService from "../services/settlements.service.js";

/**
 * 자동 결제 스케줄러 초기화
 */
export const initAutoPayScheduler = () => {
  // 매월 10일 새벽 3시
  const rule = '0 3 10 * *';
  // const rule = '40 22 * * *';

  scheduleJob(rule, async function () {
    console.log('[Scheduler] 정기 자동 결제 스케줄 작업 시작...');

    try {
      // 서비스에 정의된 배치 로직만 깔끔하게 호출
      const result = await settlementsService.processBatchAutoPay();

      console.log(`[Scheduler] 작업 종료 - 성공: ${result.successCount}건`);
    } catch (error) {
      // 서비스 레이어에서 던져진 치명적 에러 처리 (로그 기록 등)
      console.error('[Scheduler] 배치 작업 실행 중 중단 에러:', error.message);
    }
  });

  console.log(`[Scheduler] 자동 결제 작업이 등록되었습니다. (실행 주기: ${rule})`);
};