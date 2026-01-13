/**
 * @file app/models/Alarm.js
 * @description alarm model
 * 251217 v1.0.0 wook 초기 생성
 */

import { DataTypes } from 'sequelize';
import  dayjs  from 'dayjs';

// 테이블명
const modelName = 'Alarm';

// 컬럼 정의
const attributes = {
  id: {
    field: 'id',
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    comment: '알림 PK',
  },
  errorCode: {
    field: 'error_code',
    type: DataTypes.STRING(20),
    allowNull: false,
    comment: '에러 코드'
  },
  message: {
    field: 'message',
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: '에러 메세지'
  },
  isResolved: {
    field: 'is_resolved',
    type: DataTypes.BOOLEAN,
    allowNull: false,
    comment: '해결 여부',
    defaultValue: false
  },
  level: {
    field: 'level',
    type: DataTypes.BIGINT,
    allowNull: false,
    comment: '에러 레벨(심각도)',
    defaultValue: 0
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
  tableName: 'alarms', // 실제 DB 테이블명
  timestamps: true,   // createdAt, updatedAt를 자동 관리
  paranoid: true,      // soft delete 설정 (deletedAt 자동 관리)
};

const Alarm = {
  init: (sequelize) => {
    const define = sequelize.define(modelName, attributes, option);

    return define;
  },
  associate: (db) => {
  },
}

export default Alarm;