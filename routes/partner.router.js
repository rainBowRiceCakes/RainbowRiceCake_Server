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
partnerRouter.post('/', authMiddleware, partnerStoreValidator, validationHandler, partnersController.store);

// --- 2. LOOK UP and UPDAETE PARTNER's INFO WORKFLOW FOR PARTNERS (파트너 페이지와 관련됨) ---
// 파트너가 Partner table에 있는 정보(profile) 가져오기
partnerRouter.get('/profile', authMiddleware, validationHandler, partnersController.showProfile); // validator 없어도 실무적으로 OK (단건 조회)

// 파트너가 Partner table에 있는 정보(profile) 수정하기
partnerRouter.put('/profile', authMiddleware, partnerUpdateValidator, validationHandler, partnersController.updateProfile);

// --- 3. ADMIN LOOKS UP PARTNER's INFO WORKFLOW FOR ADMIN (어드민 페이지와 관련됨) ---
// 어드민이 partner들의 모든 정보를 list up 하기. 
partnerRouter.get('/', authMiddleware, partnerIndexValidator, validationHandler, partnersController.index);

// 어드민이 Partner PK로 단일정보 가져오기
partnerRouter.get('/:id', authMiddleware, partnerShowValidator, validationHandler, partnersController.show);

export default partnerRouter;

// 참고: 각 validator의 용도
// storeValidator - CREATE and UPDATE (생성 및 업데이트 시 사용)
// indexValidator - DETAIL (상세 조회 시 사용)
// showValidator - LIST (목록 조회 시 사용)
// destroyValidator - DELETE (삭제 시 사용, 현재 미사용)
// -------------------------------------------------------------
// GET    /        -> index
// POST   /        -> store
// GET    /:id    -> show
// PUT    /:id    -> update
// DELETE /:id    -> destroy
// -------------------------------------------------------------
// index    // 리스트 조회
// show     // 단건 조회
// store    // 생성
// update   // 수정
// destroy  // 삭제

// create   // 작성 페이지
// edit     // 수정 페이지
