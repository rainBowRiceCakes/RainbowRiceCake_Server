/**
 * @file app/schedulers/transferScheduler.js
 * @description 매월 자동 정산 송금 실행 스케줄러
 */

import { scheduleJob } from "node-schedule";
import { processSettlementTransfers } from "../utils/toss/moneyTransfer.util.js";
import { logger } from "../middlewares/loggers/winston.logger.js";

export const initTransferScheduler = () => {
  // 매월 10일 오전 10시에 실행
  const rule = '0 10 10 * *'; 

  // (테스트용 1분마다 실행)
  // const rule = '*/1 * * * *'; 

  scheduleJob(rule, async () => {
    logger.info('[Scheduler] Starting scheduled settlement transfer job.');
    try {
      await processSettlementTransfers();
      logger.info('[Scheduler] Finished scheduled settlement transfer job successfully.');
    } catch (error) {
      logger.error(`[Scheduler] An error occurred during the scheduled settlement transfer job: ${error.message}\n${error.stack}`);
    }
  });

  logger.info(`[Scheduler] Transfer job registered with rule: ${rule}`);
};