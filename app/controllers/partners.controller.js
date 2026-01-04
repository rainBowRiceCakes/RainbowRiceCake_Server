/**
 * @file app/controllers/partners.controller.js
 * @description 기사 관련 컨트롤러
 * 251223 v1.0.0 wook init
 * 251226 v1.1.0 BSONG update 유저-정보 등록 / 파트너-myinfo 가져오고 수정하기 / 어드민-개개인의 파트너들의 리스트와 정보를 가져오기 기능 추가.
 */

import { SUCCESS } from "../../configs/responseCode.config.js";
import partnersService from "../services/partners.service.js";
import { createBaseResponse } from "../utils/createBaseResponse.util.js";

// --- 1. ADD PARTNER's INFO WORKFLOW FOR USERS (유저와 관련됨) ---
/**
 * Partner테이블에 정보 등록 처리 (유저가 파트너 신청)
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @return {import("express").Response}
 */
async function store(req, res, next) {
  try {
    const data = req.body;

    const createData = {
      ...data,
      userId: req.user.id,
    };

    const result = await partnersService.createPartner(createData);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, result));
  } catch (error) {
    return next(error);
  }
}

// --- 3. ADMIN LOOKS UP PARTNER's INFO WORKFLOW FOR ADMIN (어드민 페이지와 관련됨) ---
/**
 * 어드민이 모든 파트너 리스트 조회
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @return {import("express").Response}
 */
async function index(req, res, next) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 9;
    const { status, search } = req.query;

    const { count, rows } = await partnersService.listPartners({ page, limit, status, search });

    const totalPages = Math.ceil(count / limit);

    const result = {
      partners: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages,
      }
    }

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, result));
  } catch (error) {
    return next(error);
  }
}

/**
 * 어드민이 특정 파트너 단일 정보 조회
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @return {import("express").Response}
 */
async function show(req, res, next) {
  try {
    const partnerId = req.params.id;
    const result = await partnersService.getPartnerById(partnerId);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, result));
  } catch (error) {
    return next(error);
  }
}

// 파트너 신청(유저 -> 파트너)
async function partnerFormStore(req, res, next) {
  try {
    // 데이터 준비
    const data = req.body;
    data.userId = req.user.id; // 로그인 미들웨어에서 받은 userId 주입

    // 서비스 호출 (신청 데이터 저장)
    await partnersService.partnerFormCreate(data);

    // 응답 반환
    // 성공 시 result에는 DB에 생성된 신청 정보가 들어있음.
    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS));
  }
  catch (error) {
    return next(error);
  }
}

export default {
  store,
  index,
  show,
  partnerFormStore
}

