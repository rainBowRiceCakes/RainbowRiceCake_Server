/**
 * @file app/controllers/hotels.controller.js
 * @description 호텔 관련 컨트롤러
 * 251222 v1.0.0 wook init
 */

import { SUCCESS } from "../../configs/responseCode.config.js";
import hotelsService from "../services/hotels.service.js";
import { createBaseResponse } from "../utils/createBaseResponse.util.js";

async function hotelShow(req, res, next) {
  try {
    const page = req.query?.page ? parseInt(req.query?.page) : 1;

    const result = await hotelsService.show(page);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, result))
  } catch (error) {
    return next(error)
  }
}

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
  hotelShow,
  hotelCreate,
}