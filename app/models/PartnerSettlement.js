/**
 * @file app/models/PartnerSettlement.js
 * @description partner settlement model
 * 251217 v1.0.0 wook 초기 생성
 */

import { DataTypes } from 'sequelize';
import dayjs from 'dayjs';

// 테이블명
const modelName = 'PartnerSettlement';

// 컬럼 정의
const attributes = {
  id: {
    field: 'id',
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    comment: '정산 PK',
  },
  partnerId: {
    field: 'partner_id',
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    comment: '기사 PK'
  },
  year: {
    field: 'year',
    type: DataTypes.BIGINT,
    allowNull: false,
    comment: '정산 연도'
  },
  month: {
    field: 'month',
    type: DataTypes.BIGINT,
    allowNull: false,
    comment: '정산 월'
  },
  totalAmount: {
    field: 'total_amount',
    type: DataTypes.BIGINT,
    allowNull: false,
    comment: '총 정산금'
  },
  status: {
    field: 'status',
    type: DataTypes.STRING(10),
    allowNull: false,
    defaultValue: 'PENDING',
    comment: 'PENDING(대기), PAID(완납), FAILED(실패), CANCEL(취소)'
  },
  paymentMethod: {
    field: 'payment_method',
    type: DataTypes.STRING(10),
    allowNull: true,
    comment: 'AUTO(빌링키), MANUAL(직접입금), VACCOUNT(계좌)'
  },
  paidAt: {
    field: 'paid_at',
    type: DataTypes.DATE,
    allowNull: true,
    comment: '결제 성공 시각'
  },
  impUid: {
    field: 'imp_uid',
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: '포트원 고유 결제 번호'
  },
  merchantUid: {
    field: 'merchant_uid',
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: '인보이스 고유 주문 번호 (INV-YYYYMM-PK)'
  },
  failReason: {
    field: 'fail_reason',
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '결제 실패 사유'
  },
  paymentDueDate: {
    field: 'payment_due_date',
    type: DataTypes.DATE,
    allowNull: true,
    comment: '결제 예정일',
  },
  createdAt: {
    field: 'created_at',
    type: DataTypes.DATE,
    allowNull: true,
    get() {
      const val = this.getDataValue('createdAt');
      if (!val) {
        return null;
      }
      return dayjs(val).format('YYYY-MM-DD HH:mm:ss');
    }
  },
  updatedAt: {
    field: 'updated_at',
    type: DataTypes.DATE,
    allowNull: true,
    get() {
      const val = this.getDataValue('updatedAt');
      if (!val) {
        return null;
      }
      return dayjs(val).format('YYYY-MM-DD HH:mm:ss');
    }
  },
  deletedAt: {
    field: 'deleted_at',
    type: DataTypes.DATE,
    allowNull: true,
    get() {
      const val = this.getDataValue('deletedAt');
      if (!val) {
        return null;
      }
      return dayjs(val).format('YYYY-MM-DD HH:mm:ss');
    }
  }
};


const option = {
  tableName: 'partnersettlements', // 실제 DB 테이블명
  timestamps: true,   // createdAt, updatedAt를 자동 관리
  paranoid: true,      // soft delete 설정 (deletedAt 자동 관리)
};

const PartnerSettlement = {
  init: (sequelize) => {
    const define = sequelize.define(modelName, attributes, option);

    return define;
  },
  associate: (db) => {
    db.PartnerSettlement.belongsTo(db.Partner, { targetKey: 'id', foreignKey: 'partnerId', as: 'partnerSettlement_partner' });
  },
}

export default PartnerSettlement;
