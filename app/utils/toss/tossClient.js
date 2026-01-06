/**
 * @file app/utils/toss/tossClient.js
 * @description 기사님의 은행 한글명을 토스용 코드로 바꾸는 파일
 * 260105 v1.0.0 wook init
 */

import axios from 'axios';
import dotenv from 'dotenv';
import { mockTransferMoney } from './mockTransfer.js';

dotenv.config(); 

const SECRET_KEY = process.env.TOSS_SECRET_KEY; 

// // 실서비스용 토스 인증 헤더 생성
// const basicAuth = Buffer.from(`${SECRET_KEY}:`).toString('base64');

export const transferMoney = async ({ bankCode, accountNumber, amount, orderId }) => {
    if (process.env.TRANSFER_MODE === 'MOCK') {
        return mockTransferMoney({bankCode, accountNumber, amount, orderId});
    }
    // TODO: 아래는 실서비스용
    //   try {
//     const response = await axios.post(
//       'https://api.tosspayments.com/v1/payouts/transfer',
//       {
//         amount: amount,
//         bank: bankCode,
//         accountNumber: accountNumber,
//         orderId: orderId,
//         payoutType: 'GENERAL',
//       },
//       {
//         headers: {
//           Authorization: `Basic ${basicAuth}`,
//           'Content-Type': 'application/json',
//         },
//       }
//     );
//     return { success: true, data: response.data };
//   } catch (error) {
//     const errorData = error.response?.data;
//     console.error('[Toss API Error]', errorData);
    
//     return { 
//       success: false, 
//       code: errorData?.code || 'UNKNOWN',
//       message: errorData?.message || error.message 
//     };
//   }
};