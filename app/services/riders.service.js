/**
 * @file app/serivces/riders.service.js
 * @description riders Service
 * 251223 wook init
 * 251229 BSONG update
 */

import db from "../models/index.js";
import riderRepository from "../repositories/rider.repository.js";
import userRepository from "../repositories/user.repository.js";
// import userRepository from "../repositories/user.repository.js";

// --- 1. MY PROFILE WORKFLOW FOR RIDERS (기사와 관련된 profile 불러오기 & 업데이트) ---
/**
 * 기사 본인의 정보 조회
 * @param {number} userId - 현재 로그인한 유저 ID
 */
async function getMyProfile(userId) {
  const rider = await riderRepository.findByUserId(null, userId);

  if (!rider) {
    throw myError("기사님의 정보를 찾을 수 없습니다.", NOT_FOUND_ERROR);
  }

  return rider;
}

/**
 * 기사 본인의 정보 수정
 * @param {number} userId - 현재 로그인한 유저 ID
 * @param {object} updateData - 수정할 데이터
 */
async function updateMyProfile(userId, updateData) {
  return await db.sequelize.transaction(async t => {
    const rider = await riderRepository.findByUserId(t, userId);

    if (!rider) {
      throw myError("기사님의 정보를 찾을 수 없습니다.", NOT_FOUND_ERROR);
    }

    const allowedFields = [
      'phone',
      'address',
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
    await riderRepository.update(t, rider.id, allowedData);

    // 업데이트된 정보 반환
    return await riderRepository.findByPk(t, rider.id);
  });
}

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
async function riderShow() {
  return await riderRepository.riderShow(null);
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
    // 중복 신청 체크 (비즈니스 로직)
    const existingRider = await riderRepository.findByUserId(t, createData.userId);
    
    if (existingRider) {
      // 이미 신청했거나 활동 중인 경우 에러 발생
      throw myError("이미 라이더 신청이 접수되어 있거나 등록된 유저입니다.", CONFLICT_ERROR);
    }

    // DB 저장용 데이터 구성
    const riderData = {
      userId: createData.userId,
      licenseNumber: createData.licenseNumber,
      description: createData.description,
      
      // 초기 상태 설정(대기 상태)
      status: 'pending',
      
      // 필요 시 추가 필드 매핑
      // vehicleType: createData.vehicleType || 'motorcycle', 
    };

    // Repository 호출
    return await riderRepository.create(t, riderData);
  });
}

export default {
  getMyProfile,
  updateMyProfile,
  riderFindByPk,
  riderShow,
  create,
  riderFormCreate,
}
