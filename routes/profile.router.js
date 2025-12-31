/**
 * @file routes/profile.router.js
 * @description 프로필 관련 라우터
 * 251231 v1.0.0 BSONG init
 */

import express from 'express';
import authMiddleware from '../app/middlewares/auth/auth.middleware.js';
import profilesController from '../app/controllers/profiles.controller.js';
import riderUpdateValidator from '../app/middlewares/validations/validators/riders/rider.update.validator.js';
import validationHandler from '../app/middlewares/validations/validationHandler.js';

const profileRouter = express.Router();

// --- 1. MY PROFILE WORKFLOW FOR RIDERS and PARTNERS (기사/파트너 관련된 profile 불러오기 & 업데이트) ---
profileRouter.get('/',
  /* #swagger.tags = ['Profile']
    #swagger.summary = '내 프로필 조회'
    #swagger.description = '파트너/기사가 자신의 프로필 정보를 조회합니다.' */
  authMiddleware, validationHandler,
  profilesController.getMyProfile
); // validator 없어도 실무적으로 OK (단건 조회)

profileRouter.put('/',
  /* #swagger.tags = ['Profile']
    #swagger.summary = '내 프로필 수정'
    #swagger.description = '파트너/기사가 자신의 프로필 정보를 수정합니다.' */
  authMiddleware,
  riderUpdateValidator,
  validationHandler,
  profilesController.updateMyProfile
);

export default profileRouter;
