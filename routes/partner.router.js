/**
 * @file routes/partner.router.js
 * @description 어드민 관련 라우터
 * 251223 v1.0.0 wook init
 */

import express from 'express';
import authMiddleware from '../app/middlewares/auth/auth.middleware.js';
import partnersController from '../app/controllers/partners.controller.js';

const partnerRouter = express.Router();

partnerRouter.get('/', authMiddleware, partnersController.partnerShow);

export default partnerRouter;
