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

async function riderUpdate(data) {
  await db.sequelize.transaction(async t => {
    const result = await riderRepository.findByPk(t, data.id);
    result.status = data.status
    result.bank = data.bank
    result.bankNum = data.bankNum
    result.address= data.address
    
    await adminRepository.riderUpdate(t, result);

    // rider의 user_id로 userByPK받아오기
    const userData = await userRepository.riderToUserPK(t, data.userId)
    // user의 role바뀌는 처리 추가
    if(data.status === "RES") {
      userData.role = "DLV"
    } else userData.role = "COM"
    await userRepository.save(t, userData)
    return
  })
}

async function partnerUpdate(data) {
  await db.sequelize.transaction(async t => {
    const result = await partnerRepository.findByPk(t, data.id);
    result.businessNum = data.businessNum
    result.krName = data.krName
    result.enName = data.enName
    result.manager = data.manager
    result.address= data.address
    result.phone= data.phone
    result.logoImg= data.logoImg
    result.lat= data.lat
    result.lng= data.lng

    await adminRepository.partnerUpdate(t, result);

    // rider의 user_id로 userByPK받아오기
    const userData = await userRepository.partnerToUserPK(t, data.userId)
    // user의 role바뀌는 처리 추가
    if(data.status === "RES") {
      userData.role = "PTN"
    } else userData.role = "COM"
    await userRepository.save(t, userData)
    return
  })
}

export default {
  riderUpdate,
  partnerUpdate,
}