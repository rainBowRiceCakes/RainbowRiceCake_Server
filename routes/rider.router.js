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
import riderUpdateValidator from '../app/middlewares/validations/validators/riders/rider.update.validator.js';
import validationHandler from '../app/middlewares/validations/validationHandler.js';

const riderRouter = express.Router();

// --- 1. MY PROFILE WORKFLOW FOR RIDERS (기사와 관련된 profile 불러오기 & 업데이트) ---
// (기사) 
riderRouter.get('/profile',
  /* #swagger.tags = ['Riders']
    #swagger.summary = '라이더용 내 프로필 조회'
    #swagger.description = '인증된 라이더가 자신의 프로필 정보를 조회합니다.' */
  authMiddleware, validationHandler,
  ridersController.getMyProfile
); // validator 없어도 실무적으로 OK (단건 조회)

// (기사) 내 정보 내가 수정.
riderRouter.put('/profile',
  /* #swagger.tags = ['Riders']
    #swagger.summary = '라이더용 내 프로필 수정'
    #swagger.description = '인증된 라이더가 자신의 프로필 정보를 수정합니다.' */
  authMiddleware,
  riderUpdateValidator,
  validationHandler,
  ridersController.updateMyProfile
);

// --- 2. RIDER WORKFLOW FOR ADMIN (관리자와 관련된 profile 불러오기 & 업데이트) ---
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

export default riderRouter;
