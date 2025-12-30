/**
 * @file app/controllers/users.controller.js
 * @description 유저 관련 컨트롤러
 * 251230 v1.0.0 wook init
 */

import { SUCCESS } from "../../configs/responseCode.config.js";
import usersService from "../services/users.service.js";
import { createBaseResponse } from "../utils/createBaseResponse.util.js";

/**
 * User 테이블 정보 모두 가져오는 처리
 * @param {import("express").Request} req - 리퀘스트 객체
 * @param {import("express").Response} res - 레스폰스 객체
 * @param {import("express").NextFunction} next - next 객체
 * @return {import("express").Response}
 */
async function showIndex(req, res, next) {
  try {
    const data = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 9
    }

    const result = await usersService.showIndex(data);
    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, result))
  } catch (error) {
    return next(error)
  }
}

/**
 * User 테이블 정보 모두 가져오는 처리
 * @param {import("express").Request} req - 리퀘스트 객체
 * @param {import("express").Response} res - 레스폰스 객체
 * @param {import("express").NextFunction} next - next 객체
 * @return {import("express").Response}
 */
async function showDetail(req, res, next) {
  try {
    const id = req.params.id

    const result = await usersService.showDetail(id);
    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, result))
  } catch (error) {
    return next(error)
  }
}

/**
 * User 테이블 정보 모두 가져오는 처리
 * @param {import("express").Request} req - 리퀘스트 객체
 * @param {import("express").Response} res - 레스폰스 객체
 * @param {import("express").NextFunction} next - next 객체
 * @return {import("express").Response}
 */
async function store(req, res, next) {
  try {
    const data = req.body

    const result = await usersService.store(data);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, result))
  } catch (error) {
    return next(error)
  }
}

/**
 * User 테이블 정보 모두 가져오는 처리
 * @param {import("express").Request} req - 리퀘스트 객체
 * @param {import("express").Response} res - 레스폰스 객체
 * @param {import("express").NextFunction} next - next 객체
 * @return {import("express").Response}
 */
async function userUpdate(req, res, next) {
  try {
    const data = req.body

    const result = await usersService.userUpdate(data);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, result))
  } catch (error) {
    return next(error)
  }
}

export default {
  showIndex,
  showDetail,
  store,
  userUpdate,
}