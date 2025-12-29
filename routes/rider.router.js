/**
 * @file routes/rider.router.js
 * @description 기사 관련 라우터
 * 251223 v1.0.0 wook init
 * 251220 v1.1.0 BSONG update
 */

import express from 'express';
import authMiddleware from '../app/middlewares/auth/auth.middleware.js';
import ridersController from '../app/controllers/riders.controller.js';
// import riderCreateValidator from '../app/middlewares/validations/validators/riders/rider.create.validator.js';
import riderUpdateValidator from '../app/middlewares/validations/validators/riders/rider.update.validator.js';
import validationHandler from '../app/middlewares/validations/validationHandler.js';

const riderRouter = express.Router();

// --- 1. MY PROFILE WORKFLOW FOR RIDERS (기사와 관련된 profile 불러오기 & 업데이트) ---
// (기사) 내 정보 내가 가져오기.
riderRouter.get('/profile', authMiddleware, validationHandler, ridersController.getMyProfile); // validator 없어도 실무적으로 OK (단건 조회)
// (기사) 내 정보 내가 수정.
riderRouter.put('/profile', authMiddleware, riderUpdateValidator, validationHandler, ridersController.updateMyProfile);

// Rider PK로 내 profile 가져오기
// riderRouter.get('/:id', authMiddleware, ridersController.riderFindByPk);
// -----------------------------------------------------------------------------------------------------------
// Rider table에 있는 정보 모두 가져오기
// riderRouter.get('/', authMiddleware, ridersController.riderShow);
// -----------------------------------------------------------------------------------------------------------
// Rider table에 정보 수정하기 ※ JWT로 유저id(PK)를 받아와야 함. req.user.id
// riderRouter.post('/', authMiddleware, riderCreateValidator, validationHandler, ridersController.riderCreate)

export default riderRouter;
