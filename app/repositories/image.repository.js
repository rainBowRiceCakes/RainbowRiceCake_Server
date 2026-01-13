/**
 * @file app/repositories/image.repository.js
 * @description Image Repository (이미지 생성)
 * 251225 v1.0.0 BSONG init
 */

import db from '../models/index.js';
const { Image } = db;

/**
 * 이미지 생성
 */
async function create(t = null, data) {
  return await Image.create(data, { transaction: t });
}

/**
 * 이미지 존재 여부 확인
 */
async function existsByOrderAndType(t = null, orderId, type) {
  const count = await Image.count({
    where: {
      dlvId: orderId,
      type: type
    },
    transaction: t
  });
  return count > 0;
}

/**
 * 주문의 특정 타입 이미지 조회
 */
async function findByOrderAndType(t = null, orderId, type) {
  return await Image.findOne({
    where: {
      dlvId: orderId,
      type: type
    },
    transaction: t
  });
}

/**
 * 주문의 모든 이미지 조회
 */
async function findAllByOrderId(t = null, orderId) {
  return await Image.findAll({
    where: { dlvId: orderId },
    order: [['createdAt', 'ASC']],
    transaction: t
  });
}

/**
 * 이미지 삭제
 */
async function deleteById(t = null, imageId) {
  return await Image.destroy({
    where: { id: imageId },
    transaction: t
  });
}

export default {
  create,
  existsByOrderAndType,
  findByOrderAndType,
  findAllByOrderId,
  deleteById,
};