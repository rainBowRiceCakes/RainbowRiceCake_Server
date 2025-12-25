/**
 * @file app/controllers/hotels.controller.js
 * @description 호텔 관련 컨트롤러
 * 251222 v1.0.0 wook init
 */

import { SUCCESS } from "../../configs/responseCode.config.js";
import hotelsService from "../services/hotels.service.js";
import { createBaseResponse } from "../utils/createBaseResponse.util.js";

/**
 * Hotel테이블의 정보 모두 가져오는 처리
 * @param {import("express").Request} req - 리퀘스트 객체
 * @param {import("express").Response} res - 레스폰스 객체
 * @param {import("express").NextFunction} next - next 객체
 * @return {import("express").Response}
 */
async function hotelFindByPK(req, res, next) {
  try {
    const id = req.params.id

    const result = await hotelsService.findByPk(id);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, result))
  } catch (error) {
    return next(error)
  }
}

/**
 * Hotel테이블의 정보 모두 가져오는 처리
 * @param {import("express").Request} req - 리퀘스트 객체
 * @param {import("express").Response} res - 레스폰스 객체
 * @param {import("express").NextFunction} next - next 객체
 * @return {import("express").Response}
 */
async function hotelShow(req, res, next) {
  try {
    const page = req.query?.page ? parseInt(req.query?.page) : 1;

    const result = await hotelsService.show(page);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, result))
  } catch (error) {
    return next(error)
  }
}

/**
 * Hotel테이블에 정보 등록 처리
 * @param {import("express").Request} req - 리퀘스트 객체
 * @param {import("express").Response} res - 레스폰스 객체
 * @param {import("express").NextFunction} next - next 객체
 * @return {import("express").Response}
 */
async function hotelCreate(req, res, next) {
  try {
    const data = req.body

    await hotelsService.create(data);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS))
  } catch (error) {
    return next(error)
  }
}

export default {
  hotelFindByPK,
  hotelShow,
  hotelCreate,
}