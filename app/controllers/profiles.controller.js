/**
 * @file app/controllers/profiles.controller.js
 * @description profile 관련 컨트롤러
 * 251231 v1.0.0 BSONG init
 */

import { SUCCESS } from "../../configs/responseCode.config.js";
import profilesService from "../services/profiles.service.js";
import { createBaseResponse } from "../utils/createBaseResponse.util.js";

/**
 * 프로필 조회 (Rider 또는 Partner)
 */
async function getMyProfile(req, res, next) {
  try {
    const result = await profilesService.getMyProfile(req.user);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, result));
  } catch (error) {
    return next(error);
  }
}

/**
 * 프로필 수정 (Rider 또는 Partner)
 */
async function updateMyProfile(req, res, next) {
  try {
    const result = await profilesService.updateMyProfile(req.user, req.body);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, result));
  } catch (error) {
    return next(error);
  }
}

export default {
  getMyProfile,
  updateMyProfile,
}