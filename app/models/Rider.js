/**
 * @file app/models/Rider.js
 * @description rider model
 * 251217 v1.0.0 wook 초기 생성
 */

import { DataTypes } from 'sequelize';
import  dayjs  from 'dayjs';

// 테이블명
const modelName = 'Rider';

// 컬럼 정의
const attributes = {
  id: {
    field: 'id',
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    comment: '기사 PK',
  },
  userId: {
    field: 'user_id',
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    comment: '유저 PK'
  },
  licenseImg: {
    field: 'license_img',
    type: DataTypes.STRING(250),
    allowNull: false,
    comment: '운전면허'
  },
  bank: {
    field: 'bank',
    type: DataTypes.STRING(10),
    allowNull: true,
    comment: '은행 이름'
  },
  bankNum: {
    field: 'bank_num',
    type: DataTypes.BIGINT,
    allowNull: true,
    comment: '계좌번호'
  },
  adress: {
    field: 'adress',
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: '주소(보험용)'
  },
  phone: {
    field: 'phone',
    type: DataTypes.BIGINT,
    allowNull: true,
    comment: '휴대폰 번호'
  },
  isWorking: {
    field: 'is_working',
    type: DataTypes.STRING(10),
    allowNull: false,
    comment: '출근 여부'
  },
  status: {
    field: 'status',
    type: DataTypes.STRING(10),
    allowNull: false,
    comment: '상태(대기, 활동중, 반려)'
  },
  pickupAt: {
    field: 'pickup_at',
    type: DataTypes.DATE,
    allowNull: true,
    comment: '픽업 시간'
  },
  lat: {
    field: 'lat',
    type: DataTypes.BIGINT,
    allowNull: false,
    comment: '위도'
  },
  lng: {
    field: 'lng',
    type: DataTypes.BIGINT,
    allowNull: false,
    comment: '경도'
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
  tableName: 'riders', // 실제 DB 테이블명
  timestamps: true,   // createdAt, updatedAt를 자동 관리
  paranoid: true,      // soft delete 설정 (deletedAt 자동 관리)
};

const Rider = {
  init: (sequelize) => {
    const define = sequelize.define(modelName, attributes, option);

    return define;
  },
  associate: (db) => {
    db.Rider.hasMany(db.Order, { targetKey: 'id', foreignKey: 'riderId', as: 'rider_order'}),
    db.Rider.hasMany(db.Settlement, { targetKey: 'id', foreignKey: 'riderId', as: 'rider_settlement'}),
    db.Rider.belongsTo(db.User, { targetKey: 'id', foreignKey: 'userId', as: 'rider_user'});
  },
}

export default Rider;
