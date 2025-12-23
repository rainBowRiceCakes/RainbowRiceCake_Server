/**
 * @file app/serivces/admins.service.js
 * @description admins Service
 * 251223 wook init
 */

import db from "../models/index.js";
import adminRepository from "../repositories/admin.repository.js";
import riderRepository from "../repositories/rider.repository.js";
import userRepository from "../repositories/user.repository.js";

async function riderUpdate(data) {
  await db.sequelize.transaction(async t => {
    const result = await riderRepository.findByPk(t, 2);
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

export default {
  riderUpdate,
}