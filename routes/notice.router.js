/**
 * @file routes/notice.router.js
 * @description 질의응답 관련 라우터
 * 251223 v1.0.0 wook init
 */

import express from 'express';
import authMiddleware from '../app/middlewares/auth/auth.middleware.js';
import validationHandler from '../app/middlewares/validations/validationHandler.js';
import sendValidator from '../app/middlewares/validations/validators/notices/send.validator.js';
import noticesController from '../app/controllers/notices.controller.js';
import showNoticeValidator from '../app/middlewares/validations/validators/notices/show.notice.validator.js';
import showNoticeDetailValidator from '../app/middlewares/validations/validators/notices/show.notice.detail.validator.js';

const noticeRouter = express.Router();

// Notice table에 있는 정보 모두 가져오기
noticeRouter.get('/',
    // authMiddleware,
    // showNoticeValidator,
    // validationHandler,
    noticesController.noticeShow)
// Notice table에 있는 정보 단일로 가져오기
noticeRouter.get('/:id', authMiddleware, showNoticeDetailValidator, validationHandler, noticesController.noticeShowDetail)
// Notice table에 정보 등록하기 ※ JWT로 유저id(PK)를 받아와야 함. req.user.id
noticeRouter.post('/', authMiddleware, sendValidator, validationHandler, noticesController.noticeCreate)

export default noticeRouter;