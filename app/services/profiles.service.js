/**
 * @file app/serivces/profile.service.js
 * @description profile Service  
 * 251231 BSONG init
 */

import myError from "../errors/customs/my.error.js";
import db from "../models/index.js";
import riderRepository from "../repositories/rider.repository.js";
import partnerRepository from "../repositories/partner.repository.js";
import { NOT_FOUND_ERROR, BAD_REQUEST_ERROR } from "../../configs/responseCode.config.js";

const PROFILE_CONFIG = {
  DLV: {
    repository: riderRepository,
    allowedFields: ['phone', 'address'],
    errorMessage: "기사님의 정보를 찾을 수 없습니다."
  },
  PTN: {
    repository: partnerRepository,
    allowedFields: ['manager', 'phone'],
    errorMessage: "파트너 정보를 찾을 수 없습니다."
  }
};

/**
 * 유저 정보에 따라 적절한 설정을 반환하는 내부 헬퍼 함수
 */
function _getConfig(user) {
  // 유저의 role/type에 따라 RIDER 또는 PARTNER 설정 반환
  const config = PROFILE_CONFIG[user.role];
  if (!config) throw myError("유효하지 않은 유저 타입입니다.", BAD_REQUEST_ERROR);
  return config;
}

// ------------------------------------------------------ 유저 정보 가져오기
async function getMyProfile(user) {
  const config = _getConfig(user);
  const profile = await config.repository.findByUserId(null, user.id);

  if (!profile) throw myError(config.errorMessage, NOT_FOUND_ERROR);
  return profile;
}

// ------------------------------------------------------ 유저 정보 수정하기
async function updateMyProfile(user, updateData) {
  const config = _getConfig(user);

  return await db.sequelize.transaction(async (t) => {
    const profile = await config.repository.findByUserId(t, user.id);
    if (!profile) throw myError(config.errorMessage, NOT_FOUND_ERROR);

    // 데이터 필터링 로직
    const allowedData = {};
    config.allowedFields.forEach(field => {
      if (updateData[field] !== undefined) allowedData[field] = updateData[field];
    });

    if (Object.keys(allowedData).length === 0) {
      throw myError("수정할 데이터가 없습니다.", BAD_REQUEST_ERROR);
    }

    await config.repository.update(t, profile.id, allowedData);
    return await config.repository.findByUserId(t, user.id);
  });
}

export default {
  getMyProfile,
  updateMyProfile,
};