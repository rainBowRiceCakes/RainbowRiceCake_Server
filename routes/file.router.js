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

fileRouter.post('/licenses',
  /* #swagger.tags = ['Files']
  #swagger.summary = '라이더용 라이센스 업로드'
  #swagger.description = '라이더가 라이센스를 업로드합니다.' */
  authMiddleware,
  multerMiddleware.riderLicenseUploader,
  filesController.storeLicense)

fileRouter.post('/logos',
  /* #swagger.tags = ['Files']
  #swagger.summary = '파트너용 로고 업로드'
  #swagger.description = '파트너가 로고를 업로드합니다.' */
  authMiddleware,
  multerMiddleware.partnerLogoUploader,
  filesController.storeLogo)

fileRouter.post('/attachments',
  /* #swagger.tags = ['Files']
  #swagger.summary = '유저/파트너/라이더용 첨부파일 업로드'
  #swagger.description = '유저/파트너/라이더(로그인 후)가 첨부파일을 업로드합니다.' */
  authMiddleware,
  multerMiddleware.questionAttachmentUploader,
  filesController.storeAttachments)

export default fileRouter;
