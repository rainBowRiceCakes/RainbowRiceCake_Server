/**
 * @file app/schedulers/invoice.scheduler.js
 * @description 매월 자동 정산 메일 발송 스케줄러
 */

import schedule from 'node-schedule';
import invoicesService from '../services/invoices.service.js';

export const initInvoiceScheduler = () => {
  // Cron 표현식: 0 0 10 * * (매월 10일 00시 00분 실행)
  // 테스트용: */10 * * * * * (10초마다 실행)
  const rule = '0 0 10 * *'; 
  // const rule = '*/10 * * * * *'; 

  schedule.scheduleJob(rule, async () => {
    console.log('============== [Auto Invoice Scheduler Start] ==============');
    try {
      const result = await invoicesService.sendMonthlyInvoicesToAll();
      console.log(`[Auto Invoice Scheduler End] Result:`, result);
    } catch (error) {
      console.error('[Auto Invoice Scheduler Error]', error);
    }
  });

  console.log(`[Scheduler] Invoice job scheduled for: ${rule}`);
};