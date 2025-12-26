/**
 * @file app/controllers/admins.controller.js
 * @description 어드민 관련 컨트롤러
 * 251223 v1.0.0 wook init
 */

import { SUCCESS } from "../../configs/responseCode.config.js";
import adminsService from "../services/admins.service.js";
import { createBaseResponse } from "../utils/createBaseResponse.util.js";

/**
 * admin이 rider테이블에 강제로 정보 등록하는 처리
 * @param {import("express").Request} req - 리퀘스트 객체
 * @param {import("express").Response} res - 레스폰스 객체
 * @param {import("express").NextFunction} next - next 객체
 * @return {import("express").Response}
 */
async function riderUpdate(req, res, next) {
  try {
    const data = req.body

    await adminsService.riderUpdate(data);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS))
  } catch (error) {
    return next(error);
  }
}

/**
 * admin이 partner테이블에 강제로 정보 등록하는 처리
 * @param {import("express").Request} req - 리퀘스트 객체
 * @param {import("express").Response} res - 레스폰스 객체
 * @param {import("express").NextFunction} next - next 객체
 * @return {import("express").Response}
 */
async function partnerUpdate(req, res, next) {
  try {
    const data = req.body

    await adminsService.partnerUpdate(data);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS))
  } catch (error) {
    return next(error);
  }
}

/**
 * admin이 hotel테이블에 강제로 정보 등록하는 처리
 * @param {import("express").Request} req - 리퀘스트 객체
 * @param {import("express").Response} res - 레스폰스 객체
 * @param {import("express").NextFunction} next - next 객체
 * @return {import("express").Response}
 */
async function hotelUpdate(req, res, next) {
  try {
    console.log(req.user)
    const data = req.body

    await adminsService.hotelUpdate(data);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS))
  } catch (error) {
    return next(error);
  }
}

export default {
  riderUpdate,
  partnerUpdate,
  hotelUpdate,
}