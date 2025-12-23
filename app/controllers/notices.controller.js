/**
 * @file app/controllers/notices.controller.js
 * @description 공지 관련 컨트롤러
 * 251223 v1.0.0 wook init
 */

import { SUCCESS } from "../../configs/responseCode.config.js";
import noticesService from "../services/notices.service.js";
import { createBaseResponse } from "../utils/createBaseResponse.util.js";

async function noticeShow(req, res, next) {
  try {
    const data = req.body

    const result = await noticesService.show(data);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, result))
  } catch (error) {
    return next(error)
  }
}

async function noticeCreate(req, res, next) {
  try {
    const data = req.body

    await noticesService.create(data);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS))
  } catch (error) {
    return next(error);
  }
}

export default {
  noticeShow,
  noticeCreate,
}