/**
 * @file app/serivces/admins.service.js
 * @description admins Service
 * 251223 wook init
 */

async function riderUpdate(data) {
  const result = await riderRepository.findByPk(t, id);
  result.status = data.status
  result.bank = data.bank
  result.bankNum = data.bankNum
  result.address= data.address
  return adminRepository.riderUpdate(t, result);
}

export default {
  riderUpdate,
}