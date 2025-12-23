/**
 * @file app/serivces/admins.service.js
 * @description admins Service
 * 251223 wook init
 */

async function riderUpdate(data) {
  await db.sequelize.transaction(async t => {
    const result = await riderRepository.findByPk(t, id);
    result.status = data.status
    result.bank = data.bank
    result.bankNum = data.bankNum
    result.address= data.address
    
    return await adminRepository.riderUpdate(t, result);
    
    // return
    // user의 role바뀌는 처리 추가
    
  })
}

export default {
  riderUpdate,
}