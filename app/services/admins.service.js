/**
 * @file app/serivces/admins.service.js
 * @description admins Service
 * 251223 wook init
 */

import db from "../models/index.js";
import adminRepository from "../repositories/admin.repository.js";
import partnerRepository from "../repositories/partner.repository.js";
import riderRepository from "../repositories/rider.repository.js";
import userRepository from "../repositories/user.repository.js";

/**
 * admin이 rider테이블에 강제로 정보 등록하는 처리
 * @param {import("express").Request} req - 리퀘스트 객체
 * @param {import("express").Response} res - 레스폰스 객체
 * @param {import("express").NextFunction} next - next 객체
 * @return {import("express").Response}
 */
async function riderUpdate(data) {
  await db.sequelize.transaction(async t => {
    // riderPK로 레코드 하나 가져오기
    const result = await riderRepository.findByPk(t, data.id);
    // 가져온 레코드에 수정값(data)집어넣기
    result.status = data.status
    result.bank = data.bank
    result.bankNum = data.bankNum
    result.address= data.address
    // 레코드 하나만 save처리
    await adminRepository.riderUpdate(t, result);

    // rider의 user_id로 userByPK받아오기
    const userData = await userRepository.riderToUserPK(t, data.userId)
    // user의 role바뀌는 처리 추가
    if(data.status === "RES") {
      // 상태가 RES(승인)로 바뀌면 user권한 DLV로 변경
      userData.role = "DLV"
      // 상태가 REQ(대기), REJ(반려)로 바뀌면 user권한 COM으로 변경
    } else userData.role = "COM"
    await userRepository.save(t, userData)
    return
  })
}

/**
 * admin이 partner테이블에 강제로 정보 등록하는 처리
 * @param {import("express").Request} req - 리퀘스트 객체
 * @param {import("express").Response} res - 레스폰스 객체
 * @param {import("express").NextFunction} next - next 객체
 * @return {import("express").Response}
 */
async function partnerUpdate(data) {
  await db.sequelize.transaction(async t => {
    // partnerPK로 레코드 하나 가져오기
    const result = await partnerRepository.findByPk(t, data.id);
    // 가져온 레코드에 수정값(data)집어넣기
    result.businessNum = data.businessNum
    result.krName = data.krName
    result.enName = data.enName
    result.manager = data.manager
    result.address= data.address
    result.phone= data.phone
    result.logoImg= data.logoImg
    result.lat= data.lat
    result.lng= data.lng
    // 레코드 하나만 save처리
    await adminRepository.partnerUpdate(t, result);

    // partner의 user_id로 userByPK받아오기
    const userData = await userRepository.partnerToUserPK(t, data.userId)
    // user의 role바뀌는 처리 추가
    if(data.status === "RES") {
      // 상태가 RES(승인)로 바뀌면 user권한 DLV로 변경
      userData.role = "PTN"
      // 상태가 REQ(대기), REJ(반려)로 바뀌면 user권한 COM으로 변경
    } else userData.role = "COM"
    await userRepository.save(t, userData)
    return
  })
}

export default {
  riderUpdate,
  partnerUpdate,
}