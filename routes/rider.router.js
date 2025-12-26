/**
 * @file routes/rider.router.js
 * @description 기사 관련 라우터
 * 251223 v1.0.0 wook init
 */

import express from 'express';
import authMiddleware from '../app/middlewares/auth/auth.middleware.js';
import ridersController from '../app/controllers/riders.controller.js';
import riderCreateValidator from '../app/middlewares/validations/validators/riders/rider.create.validator.js';
import validationHandler from '../app/middlewares/validations/validationHandler.js';

const riderRouter = express.Router();

// Rider PK로 정보 가져오기
riderRouter.get('/:id', authMiddleware, ridersController.riderFindByPk);
// Rider table에 있는 정보 모두 가져오기
riderRouter.get('/', authMiddleware, ridersController.riderShow);
// Rider table에 정보 등록하기 ※ JWT로 유저id(PK)를 받아와야 함. req.user.id
riderRouter.post('/', authMiddleware, riderCreateValidator, validationHandler, ridersController.riderCreate)

export default riderRouter;
