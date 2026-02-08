/**
 * @file app/serivces/riders.service.js
 * @description riders Service
 * 251223 wook init
 * 251229 BSONG update
 * 260107 sara update - create lat,lng on DB
 */

import db from "../models/index.js";
import riderRepository from "../repositories/rider.repository.js";
import { CONFLICT_ERROR, NOT_FOUND_ERROR, BAD_REQUEST_ERROR } from "../../configs/responseCode.config.js";
import myError from "../errors/customs/my.error.js";

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

// ------------- 라이더 출퇴근 확인 토글 관련 ----------2026.01.07 추가 (송보미)
async function toggleWorkStatus(userId, isWorking) {
  // 1. 유저 ID로 해당 라이더 정보 조회 (비즈니스적 연결)
  const rider = await riderRepository.findByUserId(null, userId);

  if (!rider) {
    // 에러 객체를 던지면 컨트롤러의 next(error)가 받아서 에러 미들웨어로 보냅니다.
    throw myError("해당 유저와 연결된 기사 정보를 찾을 수 없습니다.", NOT_FOUND_ERROR);
  }

  // 2. 라이더의 상태 변경 (실제 업데이트)
  const [affectedCount] = await riderRepository.updateWorkStatus(null, rider.id, isWorking);

  if (affectedCount === 0) {
    throw myError("상태 변경에 실패했거나 변경 사항이 없습니다.", BAD_REQUEST_ERROR);
  }

  // 3. 최종적으로 UI에서 필요로 하는 데이터 포맷 반환
  return { isWorking };
}

// ------------- 라이더 정산 내역 조회 관련 ----------2026.01.08 추가 (송보미)
async function getSettlementByRider(userId, userRole) {
  // 1. 유저 권한 체크 (보안 강화)
  if (userRole !== 'DLV') {
    throw myError("라이더 권한이 없는 유저입니다.", FORBIDDEN_ERROR);
  }

  // 2. 유저 ID로 기사(Rider) 정보 조회
  const rider = await riderRepository.findByUserId(null, userId);

  if (!rider) {
    throw myError("해당 유저와 연결된 기사 정보를 찾을 수 없습니다.", NOT_FOUND_ERROR);
  }

  // 3. 기사 ID로 정산 테이블 조회
  const settlementData = await riderRepository.getSettlementByRider(null, rider.id);

  // 4. 결과 반환 (데이터가 없을 경우 빈 배열/객체 처리 등)
  return settlementData || [];
}

// ------------- 라이더 정산 내역 상세 조회 관련 ----------2026.01.08 추가 (송보미)
async function getSettlementDetailByRider(userId, userRole, id) {
  // 1. 유저 권한 체크

  console.log('userRole', userRole);
  console.log('userId', userId);
  console.log('id', id);
  if (userRole !== 'DLV') {
    throw myError("라이더 권한이 없는 유저입니다.", FORBIDDEN_ERROR);
  }

  // 2. 유저 ID로 기사(Rider) 정보 조회
  const rider = await riderRepository.findByUserId(null, userId);
  if (!rider) {
    throw myError("해당 유저와 연결된 기사 정보를 찾을 수 없습니다.", NOT_FOUND_ERROR);
  }

  // 3. settlementId로 정산 기간(year, month) 조회
  const settlement = await riderRepository.findSettlementById(null, id);
  if (!settlement) throw myError("존재하지 않는 정산 건입니다.", NOT_FOUND_ERROR);

  // 4. 기사 ID와 파라미터로 받은 정산 ID로 상세 데이터 조회
  // 보안을 위해 rider.id(본인여부)와 settlementId를 함께 조건으로 사용합니다.
  const details = await riderRepository.getOrdersByPeriod(null, rider.id, settlement.year, settlement.month);
  console.log('details', details);

  return details || [];
}

export default {
  riderFindByPk,
  riderShow,
  create,
  riderFormCreate,
  toggleWorkStatus,
  getSettlementByRider,
  getSettlementDetailByRider
}
