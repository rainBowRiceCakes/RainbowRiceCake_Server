/**
 * @file routes/question.router.js
 * @description issue나 question에 관한 라우터
 * 이 파일은 사용자, 라이더, 파트너가 제출한 이슈 보고서나 질문들을 관리하는 API 라우터입니다.
 * 관리자는 이슈 목록 조회, 상세 조회, 답변 등록 등의 기능을 제공합니다.
 * 251223 v1.0.0 BSONG init
 * 251225 v1.1.0 BSONG - Added reply functionality for questions (답변 등록 기능 추가)
 */

import express from 'express';
import authMiddleware from '../app/middlewares/auth/auth.middleware.js';
import storeValidator from '../app/middlewares/validations/validators/questions/store.validator.js';
import validationHandler from '../app/middlewares/validations/validationHandler.js';
import questionsController from '../app/controllers/questions.controller.js';

const questionRouter = express.Router();

// --- 1. ISSUE REPORT or QUESTIONS WORKFLOW (riders, partners, users) ---
// 이 섹션은 라이더, 파트너, 사용자가 이슈나 질문을 제출하는 워크플로우를 처리합니다.
/**
 * Submit Issue or Question (이슈나 문의사항 등록, 이미지는 images router 참고!)
 * POST /questions
 * 인증된 사용자가 이슈나 질문을 제출합니다.
 */
questionRouter.post('/', authMiddleware, storeValidator, validationHandler, questionsController.store);

export default questionRouter;

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