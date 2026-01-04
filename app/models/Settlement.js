/**
 * @file app/models/Settlement.js
 * @description settlement model
 * 251217 v1.0.0 wook 초기 생성
 */

import { DataTypes } from 'sequelize';
import  dayjs  from 'dayjs';

// 테이블명
const modelName = 'Settlement';

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
  riderId: {
    field: 'rider_id',
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
    type: DataTypes.STRING(3),
    allowNull: false,
    comment: '상태(REQ, RES, REJ)',
    defaultValue: 'REQ'
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
  tableName: 'settlements', // 실제 DB 테이블명
  timestamps: true,   // createdAt, updatedAt를 자동 관리
  paranoid: true,      // soft delete 설정 (deletedAt 자동 관리)
};

const Settlement = {
  init: (sequelize) => {
    const define = sequelize.define(modelName, attributes, option);

    return define;
  },
  associate: (db) => {
    db.Settlement.belongsTo(db.Order, { targetKey: 'id', foreignKey: 'stmId', as: 'settlement_order'}),
    db.Settlement.belongsTo(db.Rider, { targetKey: 'id', foreignKey: 'riderId', as: 'settlement_rider'});
  },
}

export default Settlement;
