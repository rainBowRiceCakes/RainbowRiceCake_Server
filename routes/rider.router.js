/**
 * @file routes/rider.router.js
 * @description 어드민 관련 라우터
 * 251223 v1.0.0 wook init
 */

import express from 'express';
import authMiddleware from '../app/middlewares/auth/auth.middleware.js';
import ridersController from '../app/controllers/riders.controller.js';

const riderRouter = express.Router();

riderRouter.get('/', authMiddleware, ridersController.riderShow);

export default riderRouter;
