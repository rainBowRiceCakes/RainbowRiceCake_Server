/**
 * @file routes/notice.router.js
 * @description 질의응답 관련 라우터
 * 251223 v1.0.0 wook init
 */

import express from 'express';
import authMiddleware from '../app/middlewares/auth/auth.middleware.js';
import validationHandler from '../app/middlewares/validations/validationHandler.js';
import sendValidation from '../app/middlewares/validations/validators/notices/send.validation.js';
import noticesController from '../app/controllers/notices.controller.js';
import showNoticeValidation from '../app/middlewares/validations/validators/notices/show.notice.validation.js';

const noticeRouter = express.Router();

noticeRouter.get('/', authMiddleware, showNoticeValidation, validationHandler, noticesController.noticeShow)
noticeRouter.post('/', authMiddleware, sendValidation, validationHandler, noticesController.noticeCreate)

export default noticeRouter;