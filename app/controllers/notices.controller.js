/**
 * @file app/controllers/notices.controller.js
 * @description 공지 관련 컨트롤러
 * 251223 v1.0.0 wook init
 */

import { SUCCESS } from "../../configs/responseCode.config.js";
import noticesService from "../services/notices.service.js";
import { createBaseResponse } from "../utils/createBaseResponse.util.js";

/**
 * Notice테이블의 정보 모두 가져오는 처리
 * @param {import("express").Request} req - 리퀘스트 객체
 * @param {import("express").Response} res - 레스폰스 객체
 * @param {import("express").NextFunction} next - next 객체
 * @return {import("express").Response}
 */
async function noticeShow(req, res, next) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 5;

    const { count, rows } = await noticesService.show({ page, limit });

    const totalPages = Math.ceil(count / limit);

    const result = {
      notices: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages,
      }
    }

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, result))
  } catch (error) {
    return next(error)
  }
}

/**
 * 파트너와 기사가 notice 정보 가져오기. 
 * @param {import("express").Request} req - 리퀘스트 객체
 * @param {import("express").Response} res - 레스폰스 객체
 * @param {import("express").NextFunction} next - next 객체
 * @return {import("express").Response}
 */
async function getNoticesByRole(req, res, next) {
  try {
    const userRole = req.user?.role || 'ALL';
    const result = await noticesService.getNoticesByRole(null, userRole);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, result))
  } catch (error) {
    return next(error)
  }
}


/**
 * Notice테이블의 정보 단일로 가져오는 처리
 * @param {import("express").Request} req - 리퀘스트 객체
 * @param {import("express").Response} res - 레스폰스 객체
 * @param {import("express").NextFunction} next - next 객체
 * @return {import("express").Response}
 */
async function noticeShowDetail(req, res, next) {
  try {
    const id = req.params.id

    const result = await noticesService.showDetail(id);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, result))
  } catch (error) {
    return next(error)
  }
}

/**
 * Notice테이블에 정보 등록 처리
 * @param {import("express").Request} req - 리퀘스트 객체
 * @param {import("express").Response} res - 레스폰스 객체
 * @param {import("express").NextFunction} next - next 객체
 * @return {import("express").Response}
 */
async function noticeCreate(req, res, next) {
  try {
    const data = req.body
    data.adminId = req.user.id

    await noticesService.create(data);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS))
  } catch (error) {
    return next(error);
  }
}

export default {
  noticeShow,
  getNoticesByRole,
  noticeCreate,
  noticeShowDetail,
}