/**
 * @file routes/invoice.router.js
 * @description 어드민 관련 라우터
 * 260103 v1.0.0 wook init
 */

import express from 'express';
import authMiddleware from '../app/middlewares/auth/auth.middleware.js';
import invoicesController from '../app/controllers/invoices.controller.js';

const invoiceRouter = express.Router();

// API: POST /api/invoices/send
invoiceRouter.post(
  '/send',
  authMiddleware,      // 1. 로그인 여부 체크
  invoicesController.sendInvoiceEmailPartner // 3. 컨트롤러 실행
);

export default invoiceRouter;