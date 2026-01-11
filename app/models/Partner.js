/**
 * @file app/models/Partner.js
 * @description partner model
 * 251217 v1.0.0 wook 초기 생성
 */

import { DataTypes } from 'sequelize';
import dayjs from 'dayjs';

// 테이블명
const modelName = 'Partner';

// 컬럼 정의
const attributes = {
  id: {
    field: 'id',
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    comment: '업체 PK',
  },
  userId: {
    field: 'user_id',
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    comment: '유저 PK'
  },
  businessNum: {
    field: 'business_num',
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: '사업자 번호'
  },
  krName: {
    field: 'kr_name',
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: '가계 한글이름'
  },
  enName: {
    field: 'en_name',
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: '가계 영어이름'
  },
  manager: {
    field: 'manager',
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: '담당자명'
  },
  phone: {
    field: 'phone',
    type: DataTypes.STRING(13),
    allowNull: true,
    comment: '휴대폰번호'
  },
  status: {
    field: 'status',
    type: DataTypes.STRING(3),
    allowNull: false,
    comment: '상태(REQ, RES, REJ)',
    defaultValue: 'REQ'
  },
  billingKey: {
    field: 'billing_key',
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: '포트원 발급 빌링키'
  },
  cardName: {
    field: 'card_name',
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: '등록된 카드사 명 (신한, 현대 등)'
  },
  isAutoPay: {
    field: 'is_auto_pay',
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: '자동결제 등록 여부'
  },
  logoImg: {
    field: 'logo_img',
    type: DataTypes.STRING(250),
    allowNull: false,
    comment: '가게 로고'
  },
  address: {
    field: 'address',
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: '가계 주소'
  },
  lat: {
    field: 'lat',
    type: DataTypes.DOUBLE,
    allowNull: false,
    comment: '위도'
  },
  lng: {
    field: 'lng',
    type: DataTypes.DOUBLE,
    allowNull: false,
    comment: '경도'
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
  tableName: 'partners', // 실제 DB 테이블명
  timestamps: true,   // createdAt, updatedAt를 자동 관리
  paranoid: true,      // soft delete 설정 (deletedAt 자동 관리)
};

const Partner = {
  init: (sequelize) => {
    const define = sequelize.define(modelName, attributes, option);

    return define;
  },
  associate: (db) => {
    db.Partner.belongsTo(db.User, { targetKey: 'id', foreignKey: 'userId', as: 'partner_user' });
    db.Partner.hasMany(db.Order, { targetKey: 'id', foreignKey: 'partnerId', as: 'partner_order' });
    db.Partner.hasMany(db.PartnerSettlement, { targetKey: 'id', foreignKey: 'partnerId', as: 'partner_partnerSettlement' });
  },
}

export default Partner;
