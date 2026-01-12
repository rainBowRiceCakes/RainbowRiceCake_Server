/**
 * @file app/repositories/profile.repository.js
 * @description profile Repository
 * 251231 v1.0.0 BSONG init
 */

// --- 1. MY PROFILE WORKFLOW FOR RIDERS (기사와 관련된 profile 불러오기 & 업데이트) ---
/**
 * userId로 기사 정보 조회 (기사 본인 정보 조회용)
 * @param {import("sequelize").Transaction|null} t
 * @param {number} userId - 유저 ID
 * @returns {Promise<import("../models/Partner.js").Partner|null>}
 */
async function findByUserId(t = null, userId) {
  return await Rider.findOne({
    where: { userId },
    include: [
      {
        model: User,
        as: 'rider_user',
        attributes: ['id', 'name', 'email']
      }
    ],
    transaction: t
  });
}

/**
 * 기사 본인 정보 자기가 수정
 * @param {import("sequelize").Transaction|null} t
 * @param {number} riderId - 라이더 ID
 * @param {object} updateData - 수정할 데이터
 * @returns {Promise<[number]>} - 수정된 행의 개수
 */
async function update(t = null, riderId, updateData) {
  return await Rider.update(
    updateData,
    {
      where: { id: riderId },
      transaction: t
    }
  );
}