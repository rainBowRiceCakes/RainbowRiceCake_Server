/**
 * @file app/repositories/invoices.repository.js
 * @description Invoice Repository
 */

import { Op } from 'sequelize';
import db from '../models/index.js';

const { Partner, Order, PartnerSettlement, Settlement, User } = db;

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
async function findInvoiceItems(t = null, { partnerId, riderId, year, month }) {
  if (partnerId && riderId) {
    throw new Error('partnerId와 riderId를 동시에 사용할 수 없습니다.');
  }

  if (!partnerId && !riderId) {
    throw new Error('partnerId 또는 riderId 중 하나는 필수입니다.');
  }

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);
  const where = {
    createdAt: { [Op.between]: [startDate, endDate] },
    status: 'com'
  }

  if (partnerId) {
    where.partnerId = partnerId
  }

  if (riderId) {
    where.riderId = riderId
  }

  return await Order.findAndCountAll({
    where,
    transaction: t
  });
}

/**
 * 해당 기간의 정산(주문) 내역 조회
 */
async function findInvoiceStatus(t = null, { partnerId, year, month }) {
  return await PartnerSettlement.findOne({
    where: {
      partnerId,
      year,
      month
    },
    transaction: t,
  });
}

/**
 * 해당 기간의 정산(주문) 내역 조회
 */
async function findInvoiceRider(t = null, { riderId, year, month }) {
  return await Settlement.findOne({
    where: {
      riderId,
      year,
      month,
      status: 'RES'
    },
    transaction: t,
    logging: console.log
  });
}

/**
 * 해당 기간의 정산(주문) 내역 조회
 */
async function storeInvoiceStatus(t = null, { partnerId, year, month, totalAmount }) {
  return await PartnerSettlement.create(
    { partnerId, year, month, totalAmount },
    {
      transaction: t,
    });
}

/**
 * [추가] 정산 ID로 정산 내역 및 파트너 빌링키 상세 조회
 */
async function findSettlementWithPartner(t = null, settlementId) {
  return await PartnerSettlement.findByPk(settlementId, {
    include: [{
      model: Partner,
      as: 'partnerSettlement_partner',
      include:
        [
          {
            model: User,
            as: 'partner_user'
          }
        ]
    }],
    transaction: t,
  });
}

/**
 * [추가] 정산 상태 업데이트
 */
async function updateSettlementStatus(t = null, settlementId, updateData) {
  return await PartnerSettlement.update(updateData, {
    where: { id: settlementId },
    transaction: t,
  });
}

/**
 * [추가] 자동결제 대상 정산 내역 일괄 조회
 * - 정산 상태: PENDING
 * - 파트너 설정: isAutoPay가 true
 */
async function findSettlementsForAutoPay(t = null) {
  return await PartnerSettlement.findAll({
    where: { status: 'PENDING' },
    include: [{
      model: Partner,
      as: 'partnerSettlement_partner',
      where: { isAutoPay: true, status: 'RES' },
      required: true, // 자동결제가 활성화된 파트너만 가져오기 위한 Inner Join
      include: [{
        model: User,
        as: 'partner_user' // 유저 정보(customerId 등)가 필요할 수 있으므로 함께 로드
      }]
    }],
    transaction: t
  });
}

/**
 * 해당 기간의 정산(주문) 내역 조회
 */
async function storeInvoiceRider(t = null, { riderId, year, month, totalAmount }) {
  return await Settlement.create(
    { riderId, year, month, totalAmount },
    {
      transaction: t,
    });
}

export default {
  findPartnerById,
  findAllPartners, // export 추가
  findInvoiceItems,
  findInvoiceStatus,
  findInvoiceRider,
  storeInvoiceStatus,
  storeInvoiceRider,
  findSettlementWithPartner,
  updateSettlementStatus,
  findSettlementsForAutoPay,
};