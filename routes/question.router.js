/**
 * @file routes/question.router.js
 * @description issue나 question에 관한 라우터
 * 이 파일은 사용자, 라이더, 파트너가 제출한 이슈 보고서나 질문들을 관리하는 API 라우터입니다.
 * 관리자는 이슈 목록 조회, 상세 조회, 답변 등록 등의 기능을 제공합니다.
 * 251223 v1.0.0 BSONG init
 * 251225 v1.1.0 BSONG - Added reply functionality for questions (답변 등록 기능 추가)
 */

import express from 'express';
import storeValidator from '../app/middlewares/validations/validators/questions/store.validator.js';
import validationHandler from '../app/middlewares/validations/validationHandler.js';
import questionsController from '../app/controllers/questions.controller.js';
import authMiddleware from '../app/middlewares/auth/auth.middleware.js';

const questionRouter = express.Router();

// --- 1. ISSUE REPORT or QUESTIONS WORKFLOW (riders, partners, users) ---
// 이 섹션은 라이더, 파트너, 사용자가 이슈나 질문을 제출하는 워크플로우를 처리합니다.
questionRouter.post('/',
  /* #swagger.tags = ['Questions']
  #swagger.summary = '파트너, 유저, 라이더용 이슈나 질문 등록'
  #swagger.description = '파트너, 유저, 라이더가 이슈나 질문을 등록합니다.' */
  authMiddleware,
  storeValidator,
  validationHandler,
  questionsController.store);

// ---2. question 조회 처리 --- sara 추가(260104) 
questionRouter.get('/',
  /* #swagger.tags = ['Questions']  
  #swagger.summary = '질문 목록 조회'
  #swagger.description = '질문 목록을 조회합니다.' */
  authMiddleware,
  questionsController.index);

export default questionRouter;
