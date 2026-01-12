// utils/portone/portone.v2.util.js

import axios from 'axios';

const PORTONE_API_URL = 'https://api.portone.io';

export const payWithBillingKey = async ({ billingKey, amount, orderName, merchantUid, customerId }) => {
  try {
    const response = await axios.post(
      `${PORTONE_API_URL}/payments/${encodeURIComponent(merchantUid)}/billing-key`,
      {
        billingKey,
        orderName,
        amount: { total: amount }, // V2는 amount를 객체로 보냅니다.
        currency: 'KRW',
        customerId,
      },
      {
        headers: {
          // .env에 저장한 시크릿 키 사용
          Authorization: `PortOne ${process.env.PORTONE_API_SECRET}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    // 포트원 서버가 보내주는 구체적인 실패 사유 추출
    const message = error.response?.data?.message || error.message;
    throw new Error(message);
  }
};

/**
 * 테스트를 위한 가짜 결제 취소 함수
 */
export const cancelPayment = async ({ paymentId, reason }) => {
  try {
    // V2 취소 엔드포인트: POST /payments/{paymentId}/cancel
    const response = await axios.post(
      `${PORTONE_API_URL}/payments/${encodeURIComponent(paymentId)}/cancel`,
      {
        reason: reason, // 취소 사유
        // 부분 취소가 필요한 경우 여기에 amount 객체를 추가하지만, 
        // 전체 취소 시에는 reason만 보내도 됩니다.
      },
      {
        headers: {
          Authorization: `PortOne ${process.env.PORTONE_API_SECRET}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data; // 취소 결과 (cancellation 정보 등) 반환
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.message;
    console.error(`[PortOne API Error] Cancel Failed: ${errorMsg}`);
    throw new Error(errorMsg);
  }
};