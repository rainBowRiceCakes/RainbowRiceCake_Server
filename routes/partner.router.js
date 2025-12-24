/**
 * @file routes/partner.router.js
 * @description 어드민 관련 라우터
 * 251223 v1.0.0 wook init
 */

import express from 'express';
import authMiddleware from '../app/middlewares/auth/auth.middleware.js';
import partnersController from '../app/controllers/partners.controller.js';
import validationHandler from '../app/middlewares/validations/validationHandler.js';
import partnerCreateValidator from '../app/middlewares/validations/validators/partners/partner.create.validator.js';

const partnerRouter = express.Router();

// Partner table에 있는 정보 모두 가져오기
partnerRouter.get('/', authMiddleware, partnersController.partnerShow);
// Partner table에 정보 등록하기 ※ JWT로 유저id(PK)를 받아와야 함. req.user.id
partnerRouter.post('/', authMiddleware, partnerCreateValidator, validationHandler, partnersController.partnerCreate);

export default partnerRouter;
