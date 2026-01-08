/**
 * @file app/controllers/riders.controller.js
 * @description 기사 관련 컨트롤러
 * 251223 v1.0.0 wook init
 */

import { SUCCESS } from "../../configs/responseCode.config.js";
import ridersService from "../services/riders.service.js";
import { createBaseResponse } from "../utils/createBaseResponse.util.js";

// -------------------------------------------------------------------------------------------
/**
 * Rider테이블의 정보 + 유저이름 모두 가져오는 처리
 * @param {import("express").Request} req - 리퀘스트 객체
 * @param {import("express").Response} res - 레스폰스 객체
 * @param {import("express").NextFunction} next - next 객체
 * @return {import("express").Response}
 */
async function riderFindByPk(req, res, next) {
  try {
    const id = req.params.id

    const result = await ridersService.riderFindByPk(id);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, result))
  } catch (error) {
    return next(error)
  }
}

/**
 * Rider테이블의 정보 + 유저데이터 모두 가져오는 처리
 * @param {import("express").Request} req - 리퀘스트 객체
 * @param {import("express").Response} res - 레스폰스 객체
 * @param {import("express").NextFunction} next - next 객체
 * @return {import("express").Response}
 */
async function riderShow(req, res, next) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 9;
    const { status, search } = req.query;

    const { count, rows } = await ridersService.riderShow({ page, limit, status, search });

    const totalPages = Math.ceil(count / limit);

    const result = {
      riders: rows,
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
 * Rider테이블에 정보 등록 처리
 * @param {import("express").Request} req - 리퀘스트 객체
 * @param {import("express").Response} res - 레스폰스 객체
 * @param {import("express").NextFunction} next - next 객체
 * @return {import("express").Response}
 */
async function riderCreate(req, res, next) {
  try {
    const data = req.body

    await ridersService.create(data);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS))
  } catch (error) {
    return next(error)
  }
}

async function riderStore(req, res, next) {
  try {
    const data = req.body;
    data.userId = req.user.id;

    await ridersService.create(data);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS));
  }
  catch (error) {
    return next(error);
  }
}

// 라이더 신청(유저 -> 라이더)
async function riderFormStore(req, res, next) {
  try {
    // 데이터 준비
    const data = req.body;
    data.userId = req.user.id; // 로그인 미들웨어에서 받은 userId 주입

    // 서비스 호출 (신청 데이터만 저장)
    const result = await ridersService.riderFormCreate(data);

    // 응답 반환
    // 성공 시 result에는 DB에 생성된 신청 정보가 들어있음
    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, result));
  }
  catch (error) {
    return next(error);
  }
}

// ------------- 라이더 출퇴근 확인 토글 관련 ----------2026.01.07 추가 (송보미)
async function updateWorkStatus(req, res, next) {
  try {
    const userId = req.user.id; // 인증 미들웨어에서 넘어온 유저 PK
    const { isWorking } = req.body;

    // 비즈니스 로직은 서비스에서 처리하도록 위임
    const result = await ridersService.toggleWorkStatus(userId, isWorking);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, result));
  } catch (error) {
    return next(error);
  }
}

export default {
  riderFindByPk,
  riderShow,
  riderCreate,
  riderStore,
  riderFormStore,
  updateWorkStatus
}
