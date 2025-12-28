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
      storeKrName: createData.storeKrName,
      storeEnName: createData.storeEnName,
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

// --- 2. LOOK UP and UPDAETE PARTNER's INFO WORKFLOW FOR PARTNERS (파트너 페이지와 관련됨) ---
/**
 * 파트너 본인의 정보 조회
 * @param {number} userId - 현재 로그인한 유저 ID
 */
async function showPartnerProfile(userId) {
  const partner = await partnerRepository.findByUserId(null, userId);

  if (!partner) {
    throw myError("파트너 정보를 찾을 수 없습니다.", NOT_FOUND_ERROR);
  }

  return partner;
}

/**
 * 파트너 본인의 정보 수정
 * @param {number} userId - 현재 로그인한 유저 ID
 * @param {object} updateData - 수정할 데이터
 */
async function updatePartnerProfile(userId, updateData) {
  return await db.sequelize.transaction(async t => {
    const partner = await partnerRepository.findByUserId(t, userId);

    if (!partner) {
      throw myError("파트너 정보를 찾을 수 없습니다.", NOT_FOUND_ERROR);
    }

    const allowedFields = [
      'business_num',
      'kr_name',
      'en_name',
      'manger',
      'phone',
      'logo_img',
      'address',
      'lat',
      'lng'
    ];

    // 허용된 필드만 추출
    const allowedData = {};
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        allowedData[field] = updateData[field];
      }
    });

    // 수정할 데이터가 비어있는지 확인
    if (Object.keys(allowedData).length === 0) {
      throw myError("수정할 데이터가 없습니다.", BAD_REQUEST_ERROR);
    }

    // 업데이트 실행
    await partnerRepository.update(t, partner.id, allowedData);

    // 업데이트된 정보 반환
    return await partnerRepository.findByPk(t, partner.id);
  });
}

// --- 3. ADMIN LOOKS UP PARTNER's INFO WORKFLOW FOR ADMIN (어드민 페이지와 관련됨) ---
/**
 * 어드민이 모든 파트너 리스트 조회
 * @param {object} queryParams - 필터 등의 쿼리 파라미터
 */
async function listPartners(queryParams) {
  // 비즈니스 로직: 쿼리 파라미터 처리
  const { status, search } = queryParams;
  
  const options = {
    where: {}
  };

  // 필터 조건 추가
  if (status) {
    options.where.status = status;
  }
  
  if (search) {
    options.where.name = {
      [db.sequelize.Op.like]: `%${search}%`
    };
  }

  const { rows, count } = await partnerRepository.findAll(null, options);
  
  return {
    partners: rows,
    total: count
  };
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

export default {
  createPartner,
  showPartnerProfile,
  updatePartnerProfile,
  listPartners,
  getPartnerById,
};
