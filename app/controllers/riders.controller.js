/**
 * @file app/controllers/riders.controller.js
 * @description 기사 관련 컨트롤러
 * 251223 v1.0.0 wook init
 */

import { SUCCESS } from "../../configs/responseCode.config.js";
import ridersService from "../services/riders.service.js";
import { createBaseResponse } from "../utils/createBaseResponse.util.js";

async function riderShow(req, res, next) {
  try {
    const data = {
      body: req.body
    }
    const result = await ridersService.riderShow(data);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, result))
  } catch (error) {
    return next(error)
  }
}

async function riderCreate(req, res, next) {
  try {
      const data = req.body
  
      await ridersService.create(data);
  
      return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS))
  } catch (error) {
    return next(error)
  }
}

export default {
  riderShow,
  riderCreate,
}