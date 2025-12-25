/**
 * @file app/controllers/riders.controller.js
 * @description 기사 관련 컨트롤러
 * 251223 v1.0.0 wook init
 */

import { SUCCESS } from "../../configs/responseCode.config.js";
import ridersService from "../services/riders.service.js";
import { createBaseResponse } from "../utils/createBaseResponse.util.js";

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

async function riderFormStore(req, res, next) {
  try {
    // const data = {
    //   phone: req.body.phone,
    //   address: req.body.address,
    //   bank: req.body.bank,
    //   bankNum: req.body.bankNum,
    //   licenseImg: req.body.licenseImg
    // };
    const data = req.body;

    const result = await ridersService.riderStore(data);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, result));
  }
  catch(error) {
    return next(error);
  }
}

export default {
  riderFindByPk,
  riderShow,
  riderCreate,
  riderFormStore,
}