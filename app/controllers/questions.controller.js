/**
 * @file app/controllers/questions.controller.js
 * @description question 관련 컨트롤러
 * 이 파일은 질문(Question) 관련 비즈니스 로직을 처리하는 컨트롤러입니다.
 * 사용자, 라이더, 파트너가 이슈나 질문을 제출하고, 관리자가 조회 및 답변하는 기능을 구현합니다.
 * 251223 v1.0.0 BSONG init
 */

import { SUCCESS } from '../../configs/responseCode.config.js';
import questionsService from '../services/questions.service.js';
import { createBaseResponse } from '../utils/createBaseResponse.util.js';

// --- 1. ISSUE REPORT WORKFLOW (riders, partners, users) ---
/**
 * Submit Issue or Question (이슈나 문의사항 등록, 이미지는 images router 참고!)
 * @param {import("express").Request} req - Request 객체
 * @param {import("express").Response} res - Response 객체
 * @param {import("express").NextFunction} next - NextFuction 객체
 * @returns
 */
async function store(req, res, next) {
  try {

    console.log('📥 오리지널 바디:', req.body); // 👈 여기서 qnaImg가 있는지 확인!

    const data = req.body;
    // req.user에서 id와 role을 꺼내고, 
    // 사용할 때는 userId, userRole이라는 이름으로 할당합니다.
    const { id: userId, role: userRole } = req.user;

    const createData = {
      ...data,
      userId: userId,
      userRole: userRole,
      res: "" // 👈 일단 빈 값을 강제로 넣어줌
    };
    console.log('✅ createData:', createData);
    const result = await questionsService.create(createData);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, result));
  } catch (error) {
    return next(error);
  }
}

/**
 * qna테이블의 정보 모두 가져오는 처리
 * @param {import("express").Request} req - 리퀘스트 객체
 * @param {import("express").Response} res - 레스폰스 객체
 * @param {import("express").NextFunction} next - next 객체
 * @return {import("express").Response}
 */
async function qnaShow(req, res, next) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 9;
    const status = req.query.status; // status는 'false' 문자열로 넘어올 수 있음
    const search = req.query.search;

    const result = await questionsService.show({ page, limit, status, search });

    const totalPages = Math.ceil(result.count / limit);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, {
      qnas: result.rows,
      pagination: {
        page,
        limit,
        total: result.count,
        totalPages,
      }
    }));
  } catch (error) {
    return next(error)
  }
}

/**
 * qna테이블의 정보 모두 가져오는 처리
 * @param {import("express").Request} req - 리퀘스트 객체
 * @param {import("express").Response} res - 레스폰스 객체
 * @param {import("express").NextFunction} next - next 객체
 * @return {import("express").Response}
 */
async function qnaShowDetail(req, res, next) {
  try {
    const id = req.params.id
    const result = await questionsService.showDetail(id);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, result))
  } catch (error) {
    return next(error)
  }
}

export default {
  store,
  qnaShow,
  qnaShowDetail,
};

// RESTful API Controller Method Naming Conventions
// index : 데이터 조회 처리 (리스트 페이지 or 리스트 데이터 획득)
// show : 상세 데이터 조회 (상세 페이지 or 상세 데이터 획득)
// store : 새로운 데이터 작성 처리

// create : 작성 페이지 출력
// edit : 수정 페이지 출력
// update : 데이터 수정 처리
// destroy : 데이터 삭제

// GET    /riders        -> index
// POST   /riders        -> store
// GET    /riders/:id    -> show
// PATCH  /riders/:id    -> update
// DELETE /riders/:id    -> destroy
