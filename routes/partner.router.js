/**
 * @file routes/partner.router.js
 * @description 파트너 관련 라우터
 * 251223 v1.0.0 wook init
 * 251226 v1.1.0 BSONG update 유저-정보 등록 / 파트너-myinfo 가져오고 수정하기 / 어드민-개개인의 파트너들의 리스트와 정보를 가져오기 기능 추가.
 */

import express from 'express';
import authMiddleware from '../app/middlewares/auth/auth.middleware.js';
import validationHandler from '../app/middlewares/validations/validationHandler.js';
import partnerStoreValidator from '../app/middlewares/validations/validators/partners/partner.store.validator.js';
import partnerShowValidator from '../app/middlewares/validations/validators/partners/partner.show.validator.js';
import partnerUpdateValidator from '../app/middlewares/validations/validators/partners/partner.update.validator.js';
import partnerIndexValidator from '../app/middlewares/validations/validators/partners/partner.index.validator.js';
import partnersController from '../app/controllers/partners.controller.js';

const partnerRouter = express.Router();

// --- 1. ADD PARTNER's INFO WORKFLOW FOR USERS (유저 페이지와 관련됨) ---
// Partner table에 유저가 가입하고 제휴 폼 작성하고 승인나면 정보 등록하기 ※ JWT로 유저id(PK)를 받아와야 함. req.user.id
partnerRouter.post('/',
  /* #swagger.tags = ['Partners']
  #swagger.summary = '유저용 파트너 정보 등록'
  #swagger.description = '유저가 파트너 제휴 신청서를 작성해서 파트너 정보를 등록합니다.' */
  authMiddleware,
  partnerStoreValidator,
  validationHandler,
  partnersController.store);

// --- 2. LOOK UP and UPDAETE PARTNER's INFO WORKFLOW FOR PARTNERS (파트너 페이지와 관련됨) ---
// 파트너가 Partner table에 있는 정보(profile) 가져오기
partnerRouter.get('/profile',
  /* #swagger.tags = ['Partners']
  #swagger.summary = '파트너용 파트너 정보 조회'
  #swagger.description = '파트너가 자신의 정보를 조회합니다.' */
  authMiddleware,
  validationHandler,
  partnersController.showProfile); // validator 없어도 실무적으로 OK (단건 조회)

// 파트너가 Partner table에 있는 정보(profile) 수정하기
partnerRouter.put('/profile',
  /* #swagger.tags = ['Partners']
  #swagger.summary = '파트너용 파트너 정보 수정'
  #swagger.description = '파트너가 자신의 정보를 수정합니다.' */
  authMiddleware,
  partnerUpdateValidator,
  validationHandler,
  partnersController.updateProfile);

// --- 3. ADMIN LOOKS UP PARTNER's INFO WORKFLOW FOR ADMIN (어드민 페이지와 관련됨) ---
// 어드민이 partner들의 모든 정보를 list up 하기. 
partnerRouter.get('/',
  /* #swagger.tags = ['Partners']
  #swagger.summary = '어드민용 파트너 정보 조회'
  #swagger.description = '어드민이 파트너들의 모든 정보를 조회합니다.' */
  authMiddleware,
  partnerIndexValidator,
  validationHandler,
  partnersController.index);

// 어드민이 Partner PK로 단일정보 가져오기
partnerRouter.get('/:id',
  /* #swagger.tags = ['Partners']
  #swagger.summary = '어드민용 파트너 정보 조회'
  #swagger.description = '어드민이 파트너의 단일 정보를 조회합니다.' */
  authMiddleware,
  partnerShowValidator,
  validationHandler,
  partnersController.show);

export default partnerRouter;
