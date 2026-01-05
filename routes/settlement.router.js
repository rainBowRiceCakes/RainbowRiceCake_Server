/**
 * @file routes/settlement.router.js
 * @description 유저 관련 라우터
 * 260102 v1.0.0 wook 초기 생성
 */

import express from 'express';
import authMiddleware from '../app/middlewares/auth/auth.middleware.js';
import settlementsController from '../app/controllers/settlements.controller.js';

const settlementRouter = express.Router();

settlementRouter.get('/', authMiddleware, settlementsController.settlementShow)
settlementRouter.get('/statistics', authMiddleware, settlementsController.getStatistics);
settlementRouter.get('/month-total', authMiddleware, settlementsController.monthTotalAmount)

export default settlementRouter;