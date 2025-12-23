/**
 * @file app/controllers/partners.controller.js
 * @description 기사 관련 컨트롤러
 * 251223 v1.0.0 wook init
 */

import { SUCCESS } from "../../configs/responseCode.config.js";
import partnersService from "../services/partners.service.js";
import { createBaseResponse } from "../utils/createBaseResponse.util.js";

async function partnerShow(req, res, next) {
  try {
    const data = req.body;

    const result = await partnersService.partnerShow(data);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, result))
  } catch (error) {
    return next(error)
  }
}

export default {
  partnerShow,
}