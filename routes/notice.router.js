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
    /* #swagger.tags = ['Notices']
    #swagger.summary = '어드민용 공지사항 조회'
    #swagger.description = '어드민이 공지사항을 조회합니다.' */
    authMiddleware,
    noticesController.noticeShow)

// Notice table에 있는 정보 단일로 가져오기
noticeRouter.get('/:id',
    /* #swagger.tags = ['Notices']
    #swagger.summary = '어드민용 공지사항 디테일 조회'
    #swagger.description = '어드민이 공지사항의 디테일을 조회합니다.' */
    authMiddleware,
    showNoticeDetailValidator,
    validationHandler,
    noticesController.noticeShowDetail)

// Notice table에 정보 등록하기 ※ JWT로 유저id(PK)를 받아와야 함. req.user.id
noticeRouter.post('/',
    /* #swagger.tags = ['Notices']
    #swagger.summary = '어드민용 공지사항 등록'
    #swagger.description = '어드민이 공지사항을 등록합니다.' */
    authMiddleware,
    sendValidator,
    validationHandler,
    noticesController.noticeCreate)

// --------------------------------------------- 파트너/기사용 -------------------------------------------------
// Notice table에 있는 정보 권한별로 가져오기
noticeRouter.get('/role',
    /* #swagger.tags = ['Notices']
    #swagger.summary = '파트너, 기사용 공지사항 조회'
    #swagger.description = '파트너와 기사가 어드민이 올린 공지사항을 조회합니다.' */
    // authMiddleware,
    // showNoticeValidator,
    // validationHandler, // TODO: 주석풀기
    noticesController.noticeShowRole)

export default noticeRouter;