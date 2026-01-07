/**
 * @file routes/rider.router.js
 * @description 기사 관련 라우터
 * 251223 v1.0.0 wook init
 * 251231 v1.1.0 BSONG update about mypage
 */

import express from 'express';
import authMiddleware from '../app/middlewares/auth/auth.middleware.js';
import ridersController from '../app/controllers/riders.controller.js';
import riderCreateValidator from '../app/middlewares/validations/validators/riders/rider.create.validator.js';
import validationHandler from '../app/middlewares/validations/validationHandler.js';

const riderRouter = express.Router();

// --- 1. RIDER WORKFLOW FOR ADMIN (관리자와 관련된 profile 불러오기 & 업데이트) ---
// Rider PK로 내 profile 가져오기
riderRouter.get('/:id',
  /* #swagger.tags = ['Riders']
    #swagger.summary = '어드민이 PK로 라이더의 프로필 조회'
    #swagger.description = '어드민이 PK로 라이더의 프로필 정보를 조회합니다.' */
  authMiddleware,
  ridersController.riderFindByPk);

// -----------------------------------------------------------------------------------------------------------
// Rider table에 있는 정보 모두 가져오기
riderRouter.get('/',
  /* #swagger.tags = ['Riders']
    #swagger.summary = '어드민이 PK로 라이더의 프로필 조회'
    #swagger.description = '어드민이 PK로 라이더의 프로필 정보를 조회합니다.' */
  authMiddleware,
  ridersController.riderShow);

// -----------------------------------------------------------------------------------------------------------
// Rider table에 정보 수정하기 ※ JWT로 유저id(PK)를 받아와야 함. req.user.id
riderRouter.post('/',
  /* #swagger.tags = ['Riders']
    #swagger.summary = '어드민이 PK로 라이더의 프로필 조회'
    #swagger.description = '어드민이 PK로 라이더의 프로필 정보를 조회합니다.' */
  authMiddleware,
  riderCreateValidator,
  validationHandler,
  ridersController.riderCreate)

// -----------------------------------------------------------------------------------------------------------
// Rider 출퇴근 확인 토글
riderRouter.put('/updateWorkStatus',
  /* #swagger.tags = ['Riders']
    #swagger.summary = '라이더 출퇴근 확인 토글'
    #swagger.description = '라이더 출퇴근 확인 토글' */
  authMiddleware,
  ridersController.updateWorkStatus)

export default riderRouter;
