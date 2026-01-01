/**
 * @file app/controllers/files.controller.js
 * @description 파일 업로드 관련 컨트롤러
 * 251226 v1.0.0 wook init
 */

import { BAD_FILE_ERROR, SUCCESS } from "../../configs/responseCode.config.js";
import myError from "../errors/customs/my.error.js";
import { createBaseResponse } from "../utils/createBaseResponse.util.js";

/**
 * 기사 운전면허 업로드 컨트롤러 처리
 * @param {import("express").Request} req - Request 객체
 * @param {import("express").Response} res - Response 객체
 * @param {import("express").NextFunction} next - NextFunction 객체
 * @return {import("express").Response}
 */
async function storeLicense(req, res, next) {
  try {
    // 파일 여부 확인
    if(!req.file) {
      throw myError('파일 없음', BAD_FILE_ERROR);
    }

    const result = {
      // TODO : Test를 위한 dev경로 설정됨(ACCESS 없어짐)
      path: `${process.env.APP_URL}/${process.env.FILE_RIDER_LICENSE_IMAGE_PATH}/${req.file.filename}`
    };
    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, result));
  } catch(error) {
    next(error);
  }
}

/**
 * 매장 로고 업로드 컨트롤러 처리
 * @param {import("express").Request} req - Request 객체
 * @param {import("express").Response} res - Response 객체
 * @param {import("express").NextFunction} next - NextFunction 객체
 * @return {import("express").Response}
 */
async function storeLogo(req, res, next) {
  try {
    // 파일 여부 확인
    if(!req.file) {
      throw myError('파일 없음', BAD_FILE_ERROR);
    }

    const result = {
      // TODO : Test를 위한 dev경로 설정됨(ACCESS 없어짐)
      path: `${process.env.APP_URL}/${process.env.FILE_PARTNER_LOGO_IMAGE_PATH}/${req.file.filename}`
    };
    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, result));
  } catch(error) {
    next(error);
  }
}

/**
 * questions 남길 때, 옵셔널인 이미지 업로드 컨트롤러 처리
 * @param {import("express").Request} req - Request 객체
 * @param {import("express").Response} res - Response 객체
 * @param {import("express").NextFunction} next - NextFunction 객체
 * @return {import("express").Response}
 */
async function storeAttachments(req, res, next) {
  try {
    // 파일 여부 확인
    if(!req.file) {
      throw myError('파일 없음', BAD_FILE_ERROR);
    }

    const result = {
      path: `${process.env.APP_URL}/${process.env.ACCESS_FILE_QUESTION_IMAGE_PATH}/${req.file.filename}`
    };
    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, result));
  } catch(error) {
    next(error);
  }
}

export default {
  storeLicense,
  storeLogo,
  storeAttachments
}
