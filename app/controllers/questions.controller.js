/**
 * @file app/controllers/questions.controller.js
 * @description question 관련 컨트롤러
 * 251223 v1.0.0 BSONG init
 */

import { SUCCESS } from '../../configs/responseCode.config.js';
import questionsService from '../services/questions.service.js';
import { createBaseResponse } from '../utils/createBaseResponse.util.js';

// --------------------------------------------------------------------------------------
// public--------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------

/**
 * questions 리스트 조회 컨트롤러 처리
 * @param {import("express").Request} req - Request 객체
 * @param {import("express").Response} res - Response 객체
 * @param {import("express").NextFunction} next - NextFuction 객체
 * @returns
 */
async function index(req, res, next) {
  try {
    const page = req.query?.page ? parseInt(req.query.page) : 1; //toInt가 쿼리쪽에서 작동X

    const { count, rows } = await questionsService.pagination(page);

    const responseData = {
      page: page,
      limit: 6,
      count: count,
      questions: rows,
    };

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, responseData));
  } catch (error) {
    return next(error);
  }
}

/**
 * questions 상세 조회 컨트롤러
 * @param {import("express").Request} req - Request 객체
 * @param {import("express").Response} res - Response 객체
 * @param {import("express").NextFunction} next - NextFuction 객체
 * @returns
 */
async function show(req, res, next) {
  try {
    const result = await questionsService.show(req.params.id);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, result));
  } catch (error) {
    return next(error);
  }
}

/**
 * questions 작성 컨트롤러
 * @param {import("express").Request} req - Request 객체
 * @param {import("express").Response} res - Response 객체
 * @param {import("express").NextFunction} next - NextFuction 객체
 * @returns
 */
async function store(req, res, next) {
  try {
    const data = {
      userId: req.user.id, // auth middleware에서 set up한 값
      title: req.body.title,
      content: req.body.content,
      image: req.body.image,
    };

    const result = await questionsService.create(data);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, result));
  } catch(error) {
    return next(error);
  }
}

export default {
  index,
  show,
  store,
};
