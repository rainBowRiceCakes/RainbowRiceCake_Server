/**
 * @file app/controllers/admins.controller.js
 * @description 어드민 관련 컨트롤러
 * 251223 v1.0.0 wook init
 */

import { SUCCESS } from "../../configs/responseCode.config.js";
import adminsService from "../services/admins.service.js";
import { createBaseResponse } from "../utils/createBaseResponse.util.js";

async function riderUpdate(req, res, next) {
  try {
    const data = req.body

    await adminsService.riderUpdate(data);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS))
  } catch (error) {
    return next(error);
  }
}

export default {
  riderUpdate,
}