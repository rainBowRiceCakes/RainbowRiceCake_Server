/**
 * @file app/models/Hotel.js
 * @description hotel model
 * 251217 v1.0.0 wook 초기 생성
 */

import { DataTypes } from 'sequelize';
import  dayjs  from 'dayjs';

// 테이블명
const modelName = 'Hotel';

// 컬럼 정의
const attributes = {
  id: {
    field: 'id',
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    comment: '호텔 PK',
  },
  krName: {
    field: 'kr_name',
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: '호텔 한글이름'
  },
  enName: {
    field: 'en_name',
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: '호텔 영어이름'
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
    type: DataTypes.BOOLEAN,
    allowNull: false,
    comment: '상태',
    defaultValue: true
  },
  address: {
    field: 'address',
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: '호텔 주소'
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
  tableName: 'hotels', // 실제 DB 테이블명
  timestamps: true,   // createdAt, updatedAt를 자동 관리
  paranoid: true,      // soft delete 설정 (deletedAt 자동 관리)
};

const Hotel = {
  init: (sequelize) => {
    const define = sequelize.define(modelName, attributes, option);

    return define;
  },
  associate: (db) => {
    db.Hotel.hasMany(db.Order, { targetKey: 'id', foreignKey: 'hotelId', as: 'hotel_order'});
  },
}

export default Hotel;