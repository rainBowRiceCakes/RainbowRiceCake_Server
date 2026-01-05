/**
 * @file mockTransfer.js
 * @description 개발용 송금 Mock
 * 260105 wook init
 */

export const mockTransferMoney = async ({
  bankCode,
  accountNumber,
  amount,
  orderId,
}) => {
  console.log('[MOCK TRANSFER]');
  console.log(`은행: ${bankCode}`);
  console.log(`계좌: ${accountNumber}`);
  console.log(`금액: ${amount}`);
  console.log(`orderId: ${orderId}`);

  // 실제 API 느낌 주기
  await new Promise((resolve) => setTimeout(resolve, 300));

  // 💡 필요하면 실패 조건도 만들 수 있음
  // if (amount > 1000000) {
  //   return {
  //     success: false,
  //     code: 'MOCK_LIMIT_EXCEEDED',
  //     message: 'Mock 송금 한도 초과',
  //   };
  // }

  return {
    success: true,
    data: {
      transferId: `MOCK_${Date.now()}`,
      status: 'DONE',
    },
  };
};
