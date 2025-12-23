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

const noticeRouter = express.Router();

noticeRouter.get('/', authMiddleware, showNoticeValidator, validationHandler, noticesController.noticeShow)
noticeRouter.post('/', authMiddleware, sendValidator, validationHandler, noticesController.noticeCreate)

export default noticeRouter;