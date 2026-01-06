/**
 * @file app/serivces/riders.service.js
 * @description riders Service
 * 251223 wook init
 * 251229 BSONG update
 * 260107 sara update - create lat,lng on DB
 */

import myError from "../errors/customs/my.error.js";
import db from "../models/index.js";
import riderRepository from "../repositories/rider.repository.js";
import { CONFLICT_ERROR, NOT_FOUND_ERROR, BAD_REQUEST_ERROR } from "../../configs/responseCode.config.js";

// --------------------------------------------------------------------------------------------

/**
 * Rider PK로 한명의 정보 + 유저데이터 모두 가져오는 처리
 */
async function riderFindByPk(id) {
  return await riderRepository.findByPk(null, id);
}

/**
 * Rider테이블의 정보 + 유저이름 모두 가져오는 처리
 */
async function riderShow({ page, limit, status, search }) {
  const offset = (page - 1) * limit;
  return await riderRepository.riderShow(null, { limit, offset, status, search });
}

/**
 * Rider테이블의 정보 등록하는 처리
 * @param {import("./users.service.type.js").riderStoreData} data
 */
async function create(data) {
  return await riderRepository.create(null, data);
}

/**
 * 라이더 신청 form
 * @param {import("./users.service.type.js").riderStoreData} data
 */
async function riderFormCreate(createData) {
  return await db.sequelize.transaction(async (t) => {
    const { userId } = createData;

    // 중복 신청 체크 (비즈니스 로직)
    const existingRider = await riderRepository.findByUserId(t, userId);

    if (existingRider) {
      // 이미 신청했거나 활동 중인 경우 에러 발생
      throw myError("이미 라이더 신청이 접수되어 있거나 등록된 유저입니다.", CONFLICT_ERROR);
      // return existingRider;
    }

    // DB 저장용 데이터 구성
    const riderData = {
      userId: userId,
      phone: createData.phone,
      address: createData.address,
      bank: createData.bank,
      bankNum: createData.bankNum,
      licenseImg: createData.licenseImg,
      lat: createData.lat, // 260107 sara init
      lng: createData.lng, // 260107 sara init
    };

    // Repository 통해 DB에 저장
    const newRider = await riderRepository.create(t, riderData);

    return newRider
  });
}

export default {
  riderFindByPk,
  riderShow,
  create,
  riderFormCreate,
}
