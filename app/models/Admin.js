/**
 * @file app/models/Admin.js
 * @description admin model
 * 251217 v1.0.0 wook 초기 생성
 */

import { DataTypes } from 'sequelize';
import  dayjs  from 'dayjs';

// 테이블명
const modelName = 'admin';

// 컬럼 정의
const attributes = {
  id: {
    field: 'id',
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    comment: '관리자 PK',
  },
  email: {
    field: 'email',
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    comment: '로그인 ID(이메일)'
  },
  name: {
    field: 'name',
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: '이름',
  },
  password: {
    field: 'password',
    type: DataTypes.STRING(250),
    allowNull: false,
    comment: '비밀번호',
  },
  role: {
    field: 'role',
    type: DataTypes.STRING(3),
    allowNull: false,
    comment: '유저 권한',
    defaultValue: 'ADM',
  },
  refreshToken: {
    field: 'refresh_token',
    type: DataTypes.STRING(250),
    allowNull: true,
    comment: '리프래시토큰',
    defaultValue: null,
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
  tableName: 'admins', // 실제 DB 테이블명
  timestamps: true,   // createdAt, updatedAt를 자동 관리
  paranoid: true,      // soft delete 설정 (deletedAt 자동 관리)
};

const Admin = {
  init: (sequelize) => {
    const define = sequelize.define(modelName, attributes, option);

    // JSON으로 serialize시, 제외할 컬럼을 지정
    define.prototype.toJSON = function() {
      const attributes = this.get();
      delete attributes.password;
      delete attributes.refreshToken;

      return attributes;
    }

    return define;
  },
  associate: (db) => {
    db.Admin.hasMany(db.Settlement, { targetKey: 'id', foreignKey: 'adminId', as: 'admin_settle'}),
    db.Admin.hasMany(db.Notice, { targetKey: 'id', foreignKey: 'adminId', as: 'admin_notice'});
  },
}

export default Admin;