/**
 * @file app/services/invoices.service.js
 * @description Invoice Service
 */

import invoiceRepository from "../repositories/invoices.repository.js";
import nodemailer from 'nodemailer';
import partnerRepository from "../repositories/partner.repository.js";
import db from "../models/index.js";

/**
 * [핵심] 단건 발송 로직
 * - Controller에서 호출 (수동 발송)
 * - Service 내부의 일괄 발송 함수에서 호출 (자동 발송)
 */
async function processAndSendInvoice({ partnerId, year, month }) {
  return await db.sequelize.transaction(async t => {
    // 1. DB 데이터 조회
    const partner = await partnerRepository.findByPk(t, partnerId);

    // 유효성 검증
    if (!partner) throw new Error(`Partner ID ${partnerId} not found.`);
    if (!partner.partner_user.email) throw new Error(`Partner ${partner.krName} has no email.`);
    
    // 정산 내역 조회
    const invoiceItems = await invoiceRepository.findInvoiceItems(t, partnerId, year, month);
    if (!invoiceItems || invoiceItems.length === 0) {
        // 내역이 없으면 에러보다는 '발송 안 함' 처리 (일괄 발송 시 중단을 막기 위함)
        return { status: 'skipped', message: 'No items to invoice' };
    }

    // 3. 데이터 가공
    const totalAmount = invoiceItems.reduce((acc, cur) => acc + Number(cur.price), 0);

    // 4. HTML 템플릿
    const htmlContent = `
        <div style="padding: 20px; border: 1px solid #ccc;">
        <h2>${partner.krName} ${month}월 정산 내역</h2>
        <p>안녕하세요, <strong>${partner.manager || '담당자'}</strong> 님.</p>
        <hr />
        <p>귀사의 ${year}년 ${month}월 매출 정산 내역을 보내드립니다.</p>
        <p><strong>청구 총액:</strong> <span style="color:blue;">${totalAmount.toLocaleString()}원</span></p>
        </div>
    `;

    // 5. 이메일 발송 설정 (DB에서 가져온 partner 정보 사용)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: `"DGD" <${process.env.EMAIL_USER}>`,
        to: partner.partner_user.email, // ★ DB의 Partner 테이블에서 가져온 이메일 사용
        subject: `[★☆정산 요청☆★] ${partner.krName} ${month}월 정산 명세서`,
        html: htmlContent,
    };

    await transporter.sendMail(mailOptions);

    return { status: 'sent', partner: partner.krName, email: partner.partner_user.email };
  })
}

/**
 * [추가] 월간 정산 일괄 발송 (스케줄러용)
 * - 모든 파트너를 조회하여 지난달 정산 내역을 전송
 */
async function sendMonthlyInvoicesToAll() {
  // 날짜 계산: 오늘 기준으로 '지난달'을 구함
  const now = new Date();
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const year = lastMonthDate.getFullYear();
  const month = lastMonthDate.getMonth() + 1;

  console.log(`[DEBUG] 현재 시간: ${now.toLocaleString()}`);
  console.log(`[DEBUG] 정산 타겟: ${year}년 ${month}월`);

  console.log(`[Scheduler] Starting invoice job for ${year}-${month}`);

  // 1. 모든 파트너 조회
  const partners = await invoiceRepository.findAllPartners();
  const results = { success: 0, skipped: 0, failed: 0, errors: [] };

  // 2. 반복문으로 각 파트너에게 메일 발송
  for (const partner of partners) {
    try {
      const result = await processAndSendInvoice({ 
        partnerId: partner.id, 
        year, 
        month 
      });

      if (result.status === 'sent') results.success++;
      else results.skipped++;

    } catch (error) {
      console.error(`Error sending to ${partner.krName}:`, error.message);
      results.failed++;
      results.errors.push({ partner: partner.krName, error: error.message });
    }
  }

  return results;
}

export default {
  processAndSendInvoice,
  sendMonthlyInvoicesToAll,
};