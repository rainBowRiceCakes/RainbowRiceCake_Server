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

  if (!errors.isEmpty()) {
    const customErrors = errors.formatWith(error => `${error.path}: ${error.msg}`);

    // [수정] 안전하게 로그 남기기
    console.log("Validation Failed for User:", req.user?.id || 'Unknown User');
    console.log("Errors:", customErrors.array());
    console.log("Debug - User ID:", req.user?.id);

    return res.status(BAD_REQUEST_ERROR.status).send(createBaseResponse(BAD_REQUEST_ERROR, customErrors.array()));
  }
  next();
}