/**
 * @file routes/settlement.router.js
 * @description 유저 관련 라우터
 * 260102 v1.0.0 wook 초기 생성
 */

import express from 'express';
import authMiddleware from '../app/middlewares/auth/auth.middleware.js';
import settlementsController from '../app/controllers/settlements.controller.js';

const settlementRouter = express.Router();

/**
 * @route   GET /api/settlements/test/batch-run
 * @desc    자동 결제 배치 강제 실행 테스트
 * @access  Private (Admin)
 */
settlementRouter.get('/test/batch-run',
    // authMiddleware, 
    settlementsController.runBatchTest);

settlementRouter.get('/', authMiddleware, settlementsController.settlementShow);
settlementRouter.get('/statistics', authMiddleware, settlementsController.getStatistics);
settlementRouter.get('/month-total', authMiddleware, settlementsController.monthTotalAmount);
settlementRouter.get('/three-months-total', authMiddleware, settlementsController.getLastThreeMonthsTotalAmount);

// 정산 상세 내역 조회
settlementRouter.get('/:id', authMiddleware, settlementsController.getSettlementDetail);
// 정산 재시도
settlementRouter.post('/:id/retry', authMiddleware, settlementsController.retrySettlement);

// ----------------------------------송보미 추가 (26.01.11)----------------------------------
// 정산 자동 결제 테스트 (파트너)
settlementRouter.post('/:id/autopay', authMiddleware, settlementsController.testAutoPay);
// 정산 결제 취소 테스트 (파트너)
settlementRouter.post('/:id/cancel', authMiddleware, settlementsController.testCancelPay);


export default settlementRouter;