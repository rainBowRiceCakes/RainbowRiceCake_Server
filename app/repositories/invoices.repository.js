/**
 * @file app/repositories/invoices.repository.js
 * @description Invoice Repository
 */

import { Op } from 'sequelize';
import db from '../models/index.js';

const { Partner, Order } = db;

/**
 * 파트너 ID로 상세정보 조회
 */
async function findPartnerById(t = null, id) {
  return await Partner.findByPk(id, { transaction: t });
}

/**
 * [추가] 모든 파트너 조회 (상태가 Active인 파트너만 조회하는 조건 추가 권장)
 */
async function findAllPartners(t = null) {
  return await Partner.findAll({
    where: { status: 'RES' }, // 예: 승인된(RES) 매장만 조회
    transaction: t,
  });
}

/**
 * 해당 기간의 정산(주문) 내역 조회
 */
async function findInvoiceItems(t = null, partnerId, year, month) {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);

  return await Order.findAll({
    where: {
      partnerId: partnerId,
      createdAt: { [Op.between]: [startDate, endDate] },
      status: 'com'
    },
    transaction: t,
    raw: true
  });
}

export default {
  findPartnerById,
  findAllPartners, // export 추가
  findInvoiceItems,
};