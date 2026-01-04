/**
 * @file app/serivces/partners.service.js
 * @description partners Service
 * 251223 v.1.0.0 wook init
 * 251226 v.1.1.0 BSONG update 유저-정보 등록 / 파트너-myinfo 가져오고 수정하기 / 어드민-개개인의 파트너들의 리스트와 정보를 가져오기 기능 추가.
 */

import db from "../models/index.js";
import partnerRepository from "../repositories/partner.repository.js";
import myError from "../errors/customs/my.error.js";
import { CONFLICT_ERROR, NOT_FOUND_ERROR, BAD_REQUEST_ERROR } from "../../configs/responseCode.config.js";

// --- 1. ADD PARTNER's INFO WORKFLOW FOR USERS (유저와 관련됨) ---
/**
 * 유저가 파트너 등록을 요청한다. 
 * @param {Object} createData - 파트너 등록 데이터
 * @param {import("./users.service.type.js").partnerStoreData} data - 파트너 등록 데이터
 */
async function createPartner(createData) {
  return await db.sequelize.transaction(async t => {
    const existingPartner = await partnerRepository.findByUserId(t, userId);
    if (existingPartner) {
      throw myError("이미 파트너로 등록되어 있습니다.", CONFLICT_ERROR);
    }

    // 2. DB 저장용 데이터 구성 (비즈니스 로직)
    const partnerData = {
      userId: createData.userId,
      businessNum: createData.businessNum,
      krName: createData.krName,
      enName: createData.enName,
      manager: createData.manager,
      phone: createData.phone,
      status: 'req',  // 👈 초기 상태 설정 (비즈니스 규칙) 혹은 pending
      logoImg: createData.logoImg || null,
      address: createData.address,
      lat: createData.lat,
      lng: createData.lng,
    };

    return await partnerRepository.create(t, partnerData);
  });
}

// --- 3. ADMIN LOOKS UP PARTNER's INFO WORKFLOW FOR ADMIN (어드민 페이지와 관련됨) ---
/**
 * 어드민이 모든 파트너 리스트 조회
 * @param {object} queryParams - 필터 등의 쿼리 파라미터
 */
async function listPartners({ page, limit, status, search }) {
  const offset = (page - 1) * limit;
  // 비즈니스 로직: 쿼리 파라미터 처리
  return await partnerRepository.findAndCountAll(null, { limit, offset, status, search });
}

/**
 * 어드민이 특정 파트너 단일 정보 조회
 * @param {number} partnerId - 조회할 파트너 ID
 */
async function getPartnerById(partnerId) {
  const partner = await partnerRepository.findByPk(null, partnerId);

  if (!partner) {
    throw myError("파트너를 찾을 수 없습니다.", NOT_FOUND_ERROR);
  }

  return partner;
}

/**
 * 파트너 신청 form
 * @param {import("./users.service.type.js").partnerStoreData} data
 */
async function partnerFormCreate(createData) {
  return await db.sequelize.transaction(async (t) => {
    const { userId } = createData;

    // 중복 신청 체크 (비즈니스 로직)
    const existingPartner = await partnerRepository.findByUserId(t, userId);

    if (existingPartner) {
      // 이미 신청했거나 활동 중인 경우 에러 발생
      throw myError("이미 파트너 신청이 접수되어 있거나 등록된 유저입니다.", CONFLICT_ERROR);
      // return existingPartner
    }

    // DB 저장용 데이터 구성
    const partnerData = {
      userId: userId,
      manager: createData.manager,
      phone: createData.phone,
      krName: createData.krName,
      enName: createData.enName,
      businessNum: createData.businessNum,
      address: createData.address,
      logoImg: createData.logoImg,
      lat: createData.lat,
      lng: createData.lng,
    };

    // Repository 호출
    const newPartner = await partnerRepository.create(t, partnerData);

    return newPartner
  });
}

export default {
  createPartner,
  listPartners,
  getPartnerById,
  partnerFormCreate,
};
