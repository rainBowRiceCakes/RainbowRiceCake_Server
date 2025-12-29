/**
 * @file routes/file.router.js
 * @description 파일 업로드 관련 라우터
 * 251226 v1.0.0 wook init
 */

import express from 'express';
import authMiddleware from '../app/middlewares/auth/auth.middleware.js';
import multerMiddleware from '../app/middlewares/multer/multer.middleware.js';
import filesController from '../app/controllers/files.controller.js';

const fileRouter = express.Router();

fileRouter.post('/licenses', authMiddleware, multerMiddleware.riderLicenseUploader, filesController.storeLicense);
fileRouter.post('/logos', authMiddleware, multerMiddleware.partnerLogoUploader, filesController.storeLogo);
fileRouter.post(
  '/attachments',
  // authMiddleware, TODO: 주석풀기
  multerMiddleware.questionAttachmentUploader,
  filesController.storeAttachments)

export default fileRouter;
