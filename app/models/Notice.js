/**
 * @file app/models/Notice.js
 * @description notice model
 * 251217 v1.0.0 wook 초기 생성
 */

import { DataTypes } from 'sequelize';
import  dayjs  from 'dayjs';

// 테이블명
const modelName = 'Notice';

// 컬럼 정의
const attributes = {
  id: {
    field: 'id',
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    comment: '공지 PK',
  },
  adminId: {
    field: 'admin_id',
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    comment: '관리자 PK'
  },
  title: {
    field: 'title',
    type: DataTypes.STRING(30),
    allowNull: false,
    comment: '제목'
  },
  content: {
    field: 'content',
    type: DataTypes.STRING(250),
    allowNull: false,
    comment: '내용'
  },
  target_role: {
    field: 'target_role',
    type: DataTypes.STRING(3),
    allowNull: false,
    comment: '수신 대상'
  },
  status: {
    field: 'status',
    type: DataTypes.BOOLEAN,
    allowNull: false,
    comment: '해결상태',
    defaultValue: false
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
  tableName: 'notices', // 실제 DB 테이블명
  timestamps: true,   // createdAt, updatedAt를 자동 관리
  paranoid: true,      // soft delete 설정 (deletedAt 자동 관리)
};

const Notice = {
  init: (sequelize) => {
    const define = sequelize.define(modelName, attributes, option);

    return define;
  },
  associate: (db) => {
    db.Notice.belongsTo(db.Admin, { targetKey: 'id', foreignKey: 'adminId', as: 'notice_admin'});
  },
}

export default Notice;
