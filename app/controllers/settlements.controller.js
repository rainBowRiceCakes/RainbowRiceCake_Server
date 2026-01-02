/**
 * @file app/controllers/settlements.controller.js
 * @description 유저 관련 컨트롤러
 * 260102 v1.0.0 wook init
 */

import { SUCCESS } from "../../configs/responseCode.config.js";
import { createBaseResponse } from "../utils/createBaseResponse.util.js";

/**
 * 이번 달 총 거래액
 * @param {import("express").Request} req - 리퀘스트 객체
 * @param {import("express").Response} res - 레스폰스 객체
 * @param {import("express").NextFunction} next - next 객체
 * @return {import("express").Response}
 */
async function monthTotalAmount(req, res, next) {
  try {

    const result = await settlementsService.monthTotalAmount(data);
    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, result))
  } catch (error) {
    return next(error)
  }
}

export default {
  monthTotalAmount,
}