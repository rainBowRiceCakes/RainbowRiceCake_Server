/**
 * @file app/services/invoices.service.js
 * @description Invoice Service
 */

import invoicesRepository from "../repositories/invoices.repository.js";
import nodemailer from 'nodemailer';
import partnerRepository from "../repositories/partner.repository.js";
import db from "../models/index.js";
import riderRepository from "../repositories/rider.repository.js";
import dayjs from "dayjs";

/**
 * [핵심] 단건 발송 로직
 * - Controller에서 호출 (수동 발송)
 * - Service 내부의 일괄 발송 함수에서 호출 (자동 발송)
 */
async function processAndSendInvoice({ partnerId, year, month }) {
  return await db.sequelize.transaction(async t => {
    const invoiceStatus = await invoicesRepository.findInvoiceStatus(t, {partnerId, year, month})
    if(invoiceStatus) return { status: 'skipped', message: `이미 이달에 보낸 제휴업체입니다.`}
    
    // 1. DB 데이터 조회
    const partner = await partnerRepository.findByPk(t, partnerId);

    // 유효성 검증
    if (!partner) throw new Error(`Partner ID ${partnerId} not found.`);
    if (!partner.partner_user.email) throw new Error(`Partner ${partner.krName} has no email.`);
    
    // 정산 내역 조회
    const invoiceItems = await invoicesRepository.findInvoiceItems(t, {partnerId, year, month});
    if (!invoiceItems.rows || invoiceItems.rows.length === 0) {
        // 내역이 없으면 에러보다는 '발송 안 함' 처리 (일괄 발송 시 중단을 막기 위함)
        return { status: 'skipped', message: 'No items to invoice' };
    }

    // 3. 데이터 가공
    const totalAmount = invoiceItems.rows.reduce((acc, cur) => acc + Number(cur.price), 0);

    // 4. HTML 템플릿
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8" />
      <title>Invoice</title>
    </head>
    <body style="font-family: Arial, sans-serif; color:#333;">

      <div style="max-width:700px; margin:0 auto; padding:20px; border:1px solid #ccc;">

        <!-- 제목 -->
        <h2 style="text-align:center;">
          ${partner.krName} ${year}년 ${month}월 정산 내역
        </h2>

        <!-- 인사말 -->
        <p>
          안녕하세요, <strong>${partner.manager}</strong> 님.
        </p>
        <p>
          귀사의 ${year}년 ${month}월 매출 정산 내역을 아래와 같이 안내드립니다.
        </p>

        <hr style="margin:20px 0;" />

        <!-- 파트너 정보 -->
        <h3>파트너 정보</h3>
        <p>
          회사명: ${partner.krName} (${partner.enName})<br />
          사업자등록번호: ${partner.businessNum}<br />
          담당자: ${partner.manager}<br />
          연락처: ${partner.phone}<br />
          주소: ${partner.address}
        </p>

        <hr style="margin:20px 0;" />

        <!-- 정산 요약 -->
        <h3>정산 요약</h3>
        <table style="width:100%; border-collapse:collapse;">
          <tbody>
            <tr>
              <td style="border:1px solid #ccc; padding:10px;">
                해당 월 주문 건수
              </td>
              <td style="border:1px solid #ccc; padding:10px; text-align:right;">
                ${invoiceItems.count} 건
              </td>
            </tr>
            <tr>
              <td style="border:1px solid #ccc; padding:10px;">
                청구 총액
              </td>
              <td style="border:1px solid #ccc; padding:10px; text-align:right; color:blue;">
                <strong>${totalAmount.toLocaleString()} 원</strong>
              </td>
            </tr>
          </tbody>
        </table>

        <hr style="margin:20px 0;" />

        <!-- 보안 안내 -->
        <p style="font-size:12px; color:#666;">
          ※ 본 정산 인보이스 파일은 보안 강화를 위해 암호화되어 있습니다.<br />
          비밀번호는 별도로 안내드립니다.
        </p>

      </div>

    </body>
    </html>
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
        subject: `[DGD] ${partner.krName} ${month}월 정산 명세서`,
        html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    await invoicesRepository.storeInvoiceStatus(t, {partnerId, year, month, totalAmount})
    return { status: 'sent', partner: partner.krName, email: partner.partner_user.email };
  })
}

/**
 * [추가] 월간 정산 일괄 발송 (스케줄러용)
 * - 모든 파트너를 조회하여 지난달 정산 내역을 전송
 */
async function sendMonthlyInvoicesToAll() {
  return await db.sequelize.transaction(async t => {
    // 날짜 계산: 오늘 기준으로 '지난달'을 구함
    const now = new Date();
    const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const year = lastMonthDate.getFullYear();
    const month = lastMonthDate.getMonth() + 1;

    console.log(`[DEBUG] 현재 시간: ${now.toLocaleString()}`);
    console.log(`[DEBUG] 정산 타겟: ${year}년 ${month}월`);

    console.log(`[Scheduler] Starting invoice job for ${year}-${month}`);

    // 1. 모든 파트너 조회
    const partners = await invoicesRepository.findAllPartners();
    const results = { success: 0, skipped: 0, failed: 0, errors: [] };

    // 2. 반복문으로 각 파트너에게 메일 발송
    for (const partner of partners) {
      try {
        const invoiceStatus = await invoicesRepository.findInvoiceStatus(t, {partnerId: partner.id, year, month})
        if(invoiceStatus) return { status: 'skipped', message: `이미 이달에 보낸 제휴업체입니다.`}

        const invoiceItems = await invoicesRepository.findInvoiceItems(t, {partnerId: partner.id, year, month});
        if (!invoiceItems.rows || invoiceItems.rows.length === 0) {
            // 내역이 없으면 에러보다는 '발송 안 함' 처리 (일괄 발송 시 중단을 막기 위함)
            return { status: 'skipped', message: 'No items to invoice' };
          }
          // 3. 데이터 가공
          
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
  });
}

/**
 * [핵심] 라이더 정산 메일 단건 발송 로직
 */
async function riderProcessAndSendInvoice({ riderId, year, month, status }) {
  return await db.sequelize.transaction(async t => {
    const invoiceStatus = await invoicesRepository.findInvoiceRider(t, {riderId, year, month})
    if(invoiceStatus) {
      return { status: 'skipped', message: `이미 이달에 보낸 라이더입니다.`}
    }
    
    // 1. DB 데이터 조회
    const rider = await riderRepository.findByPk(t, riderId);

    // 유효성 검증
    if (!rider) throw new Error(`Rider ID ${riderId} not found.`);
    if (!rider.rider_user.email) throw new Error(`Rider ${rider.rider_user.name} has no email.`);
    
    // 정산 내역 조회
    const invoiceItems = await invoicesRepository.findInvoiceItems(t, { riderId, year, month });
    console.log(invoiceItems)
    if (!invoiceItems.rows || invoiceItems.rows.length === 0) {
        return { status: 'skipped', message: 'No items to invoice' };
    }

    // 3. 데이터 가공
    const totalAmount = invoiceItems.rows.reduce((acc, cur) => acc + Number(cur.price), 0);
    const todayYear = dayjs().format('YYYY')
    const todayMonth = dayjs().format('MM')
    const day = dayjs().format('DD')
    // 4. HTML 템플릿
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f6f8; font-family: 'Apple SD Gothic Neo', sans-serif;">
      
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
        
        <tr>
          <td style="background-color: #2c3e50; padding: 30px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">정산 지급 명세서</h1>
          </td>
        </tr>

        <tr>
          <td style="padding: 40px 30px 20px 30px;">
            <p style="color: #333333; font-size: 16px; margin: 0;">
              안녕하세요, <strong>${rider.rider_user.name}</strong> 님.<br>
              파트너님의 소중한 노고에 감사드립니다.<br>
              금일 요청하신 정산 건에 대한 입금이 완료되었습니다.
            </p>
          </td>
        </tr>

        <tr>
          <td style="padding: 0 30px;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px;">
              <tr>
                <td style="padding: 25px;">
                  
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-bottom: 2px solid #dde2e6; padding-bottom: 15px; margin-bottom: 15px;">
                    <tr>
                      <td style="color: #666666; font-size: 14px;">총 정산 금액</td>
                      <td style="text-align: right; color: #007bff; font-size: 26px; font-weight: bold;">
                        ₩ ${totalAmount}
                      </td>
                    </tr>
                  </table>

                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td style="padding: 8px 0; color: #666666; font-size: 14px;">정산 대상 건수</td>
                      <td style="padding: 8px 0; text-align: right; color: #333333;">
                        <strong>${invoiceItems.count}</strong> 건
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #666666; font-size: 14px;">입금 은행</td>
                      <td style="padding: 8px 0; text-align: right; color: #333333;">
                        ${rider.bank}
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #666666; font-size: 14px;">계좌 번호</td>
                      <td style="padding: 8px 0; text-align: right; color: #333333;">
                        ${rider.bankNum}
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #666666; font-size: 14px;">지급 일자</td>
                      <td style="padding: 8px 0; text-align: right; color: #333333;">
                        ${todayYear}년${todayMonth}월${day}일
                      </td>
                    </tr>
                  </table>

                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td style="padding: 30px;">
            <p style="color: #888888; font-size: 13px; line-height: 1.5; margin: 0; background-color: #fff8e1; padding: 15px; border-radius: 4px; border: 1px solid #ffeeba;">
              <strong>💡 안내사항</strong><br>
              은행 전산망 사정에 따라 실제 입금 확인까지 최대 30분~1시간 정도 소요될 수 있습니다.<br>
              입금 내역이 확인되지 않을 경우 고객센터로 문의 부탁드립니다.
            </p>
          </td>
        </tr>

        <tr>
          <td style="background-color: #343a40; padding: 20px; text-align: center;">
            <p style="color: #ced4da; font-size: 12px; margin: 0;">
              본 메일은 발신 전용입니다.<br>
              © 2026 Rainbow Rice Cake. All rights reserved.
            </p>
          </td>
        </tr>
      </table>
      
    </body>
    </html>
  `;
    
    // 5. 이메일 발송 설정 (DB에서 가져온 rider 정보 사용)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: `"DGD" <${process.env.EMAIL_USER}>`,
        to: rider.rider_user.email, // ★ DB의 Rider 테이블에서 가져온 이메일 사용
        subject: `[DGD] ${rider.rider_user.name} ${month}월 정산 명세서`,
        html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    
    // 송장 발송 상태 저장
    await invoicesRepository.storeInvoiceRider(t, {riderId, year, month, totalAmount})
    
    return { status: 'sent', rider: rider.rider_user.name, email: rider.rider_user.email };
  })
}

export default {
  processAndSendInvoice,
  sendMonthlyInvoicesToAll,
  riderProcessAndSendInvoice,
};