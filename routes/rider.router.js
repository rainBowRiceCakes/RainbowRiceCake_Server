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

riderRouter.get('/settlement',
  /* #swagger.tags = ['Riders']
    #swagger.summary = '라이더의 정산 내역 조회'
    #swagger.description = '라이더의 정산 내역을 조회합니다.' */
  authMiddleware,
  ridersController.getSettlementByRider);

riderRouter.get('/settlement/:id',
  /* #swagger.tags = ['Riders']
    #swagger.summary = '라이더의 정산 내역 상세 조회'
    #swagger.description = '라이더의 정산 내역을 조회합니다.' */
  authMiddleware,
  ridersController.getSettlementDetailByRider);

// --- 2. RIDER WORKFLOW FOR RIDER (라이더와 관련된 profile 불러오기 & 업데이트) ---
// Rider PK로 내 profile 가져오기
riderRouter.get('/:id',
  /* #swagger.tags = ['Riders']
    #swagger.summary = '라이더가 PK로 자신의 프로필 조회'
    #swagger.description = '라이더가 PK로 자신의 프로필 정보를 조회합니다.' */
  authMiddleware,
  ridersController.riderFindByPk);

// -----------------------------------------------------------------------------------------------------------
// Rider table에 있는 정보 모두 가져오기
riderRouter.get('/',
  /* #swagger.tags = ['Riders']
    #swagger.summary = '라이더가 자신의 프로필 조회'
    #swagger.description = '라이더가 자신의 프로필 정보를 조회합니다.' */
  authMiddleware,
  ridersController.riderShow);

// -----------------------------------------------------------------------------------------------------------
// Rider table에 정보 수정하기 ※ JWT로 유저id(PK)를 받아와야 함. req.user.id
riderRouter.post('/',
  /* #swagger.tags = ['Riders']
    #swagger.summary = '라이더가 자신의 프로필 수정'
    #swagger.description = '라이더가 자신의 프로필 정보를 수정합니다.' */
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

// ----------------------------------------------------------------------------------------------------------

export default riderRouter;
