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

// --- 2. LOOK UP and UPDAETE PARTNER's INFO WORKFLOW FOR PARTNERS (파트너 페이지와 관련됨) ---
/**
 * 파트너 본인의 정보 조회 (자기 자신만)
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @return {import("express").Response}
 */
async function showProfile(req, res, next) {
  try {
    const userId = req.user.id; // 현재 로그인한 유저 ID
    const result = await partnersService.showPartnerProfile(userId);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, result));
  } catch (error) {
    return next(error);
  }
}

/**
 * 파트너 본인의 정보 수정
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @return {import("express").Response}
 */
async function updateProfile(req, res, next) {
  try {
    const userId = req.user.id; // 현재 로그인한 유저 ID
    const updateData = req.body;

    const result = await partnersService.updatePartnerProfile(userId, updateData);

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
    const result = await partnersService.listPartners();

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

export default {
  store,
  showProfile,
  updateProfile,
  index,
  show,
}

