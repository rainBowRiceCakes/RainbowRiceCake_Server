/**
 * @file app/controllers/riders.controller.js
 * @description 기사 관련 컨트롤러
 * 251223 v1.0.0 wook init
 */

import { SUCCESS } from "../../configs/responseCode.config.js";
import ridersService from "../services/riders.service.js";
import { createBaseResponse } from "../utils/createBaseResponse.util.js";

// --- 1. MY PROFILE WORKFLOW FOR RIDERS (기사와 관련된 profile 불러오기 & 업데이트) ---
/**
 * RIDER의 테이블 정보 모두 가져오는 처리
 * @param {import("express").Request} req - 리퀘스트 객체
 * @param {import("express").Response} res - 레스폰스 객체
 * @param {import("express").NextFunction} next - next 객체
 * @return {import("express").Response}
 */
async function getMyProfile(req, res, next) {
  try {
    const data = req.body

    const result = await ridersService.getMyProfile(data);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, result))
  } catch (error) {
    return next(error)
  }
}

/**
 * 파트너 본인의 정보 수정
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @return {import("express").Response}
 */
async function updateMyProfile(req, res, next) {
  try {
    const userId = req.user.id; // 현재 로그인한 유저 ID
    const updateData = req.body;

    const result = await ridersService.updateMyProfile(userId, updateData);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, result));
  } catch (error) {
    return next(error);
  }
}

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
    const result = await ridersService.riderShow();

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

// async function riderFormStore(req, res, next) {
//   try {
//     // const data = {
//     //   phone: req.body.phone,
//     //   address: req.body.address,
//     //   bank: req.body.bank,
//     //   bankNum: req.body.bankNum,
//     //   licenseImg: req.body.licenseImg
//     // };
//     const data = req.body;

//     const result = await ridersService.riderStore(data);

//     return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, result));
//   }
//   catch(error) {
//     return next(error);
//   }
// }

async function riderStore(req, res, next) {
  try {
    const data = req.body;
    // data.userId = req.user.id; // TODO: 로그인기능 완성되면 추가할것
    data.userId = 12; // TODO: 로그인기능 완성되면 제거할것

    await ridersService.create(data);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS));
  }
  catch (error) {
    return next(error);
  }
}

export default {
  getMyProfile,
  updateMyProfile,
  riderFindByPk,
  riderShow,
  riderCreate,
  // riderFormStore,
  riderStore
}
