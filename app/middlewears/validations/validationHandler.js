/**
 * @file app/middlewares/validations/validationHandler.js
 * @description 유효성 검사 핸들러
 * 251218 v1.0.0 wook init
 */

import { validationResult } from "express-validator";
import { BAD_REQUEST_ERROR } from "../../../configs/responseCode.config.js";
import { createBaseResponse } from "../../utils/createBaseResponse.util.js";

export default function validationHandler(req, res, next) {
  const errors = validationResult(req);

  // 에러 발생 여부 확인
  if(!errors.isEmpty()) {
    // express validation error custom
    const customErrors = errors.formatWith(error => `${error.path}: ${error.msg}`);
    
    // 에러 응답
    return res.status(BAD_REQUEST_ERROR.status).send(createBaseResponse(BAD_REQUEST_ERROR, customErrors.array()));
  }

  next();
}