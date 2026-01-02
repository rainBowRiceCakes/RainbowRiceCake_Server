/**
 * @file app/serivces/settlements.service.js
 * @description settlements Service
 * 260102 WOOK init
 */

/**
 * 이번 달 총 거래액
 * @param {import("express").Request} req - 리퀘스트 객체
 * @param {import("express").Response} res - 레스폰스 객체
 * @param {import("express").NextFunction} next - next 객체
 * @return {import("express").Response}
 */
async function monthTotalAmount() {
  return await settlementRepository.monthTotalAmount(null)
}

export default {
  monthTotalAmount,
}