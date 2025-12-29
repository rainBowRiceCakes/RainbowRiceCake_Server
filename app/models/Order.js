/**
 * @file app/models/Order.js
 * @description order model
 * 251217 v1.0.0 wook 초기 생성
 */

import { DataTypes } from 'sequelize';
import  dayjs  from 'dayjs';

// 테이블명
const modelName = 'Order';

// 컬럼 정의
const attributes = {
  id: {
    field: 'id',
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    comment: '배송 PK',
  },
  riderId: {
    field: 'rider_id',
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: true,
    comment: '기사 PK(배차 전 Null 상태)'
  },
  partnerId: {
    field: 'partner_id',
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    comment: '업체 PK(출발지)'
  },
  hotelId: {
    field: 'hotel_id',
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    comment: '호텔 PK(도착지)'
  },
  email: {
    field: 'email',
    type: DataTypes.STRING(20),
    allowNull: false,
    comment: '이메일'
  },
  name: {
    field: 'name',
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: '받는사람 이름'
  },
  price: {
    field: 'price',
    type: DataTypes.BIGINT,
    allowNull: false,
    comment: '배송 요금'
  },
  cntS: {
    field: 'cnt_s',
    type: DataTypes.BIGINT,
    allowNull: true,
    comment: 'S사이즈 개수'
  },
  cntM: {
    field: 'cnt_m',
    type: DataTypes.BIGINT,
    allowNull: true,
    comment: 'M사이즈 개수'
  },
  cntL: {
    field: 'cnt_l',
    type: DataTypes.BIGINT,
    allowNull: true,
    comment: 'L사이즈 개수'
  },
  status: {
    field: 'status',
    type: DataTypes.STRING(10),
    allowNull: false,
    comment: '배송상태(req, match, pick, com)',
    defaultValue: 'req',
  },
  createdAt: {
      field: 'created_at',
      type: DataTypes.DATE,
      allowNull: true,
      get() {
      const val = this.getDataValue('createdAt');
      if(!val) {
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
      if(!val) {
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
      if(!val) {
          return null;
      }
      return dayjs(val).format('YYYY-MM-DD HH:mm:ss');
      }
  }
};


const option = {
  tableName: 'orders', // 실제 DB 테이블명
  timestamps: true,   // createdAt, updatedAt를 자동 관리
  paranoid: true,      // soft delete 설정 (deletedAt 자동 관리)
};

const Order = {
  init: (sequelize) => {
    const define = sequelize.define(modelName, attributes, option);

    return define;
  },
  associate: (db) => {
    db.Order.hasMany(db.Image, { targetKey: 'id', foreignKey: 'adminId', as: 'order_image'}),
    db.Order.belongsTo(db.Rider, { targetKey: 'id', foreignKey: 'riderId', as: 'order_rider'}),
    db.Order.belongsTo(db.Partner, { targetKey: 'id', foreignKey: 'partnerId', as: 'order_partner'}),
    db.Order.belongsTo(db.Hotel, { targetKey: 'id', foreignKey: 'hotelId', as: 'order_hotel'}),
    db.Order.hasMany(db.Settlement, { targetKey: 'id', foreignKey: 'stmId', as: 'order_settlement'});
  },
}

export default Order;
