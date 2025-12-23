/**
 * @file app/models/question.js
 * @description question model
 * 251218 v1.0.0 wook 초기 생성
 */

import { DataTypes } from 'sequelize';
import  dayjs  from 'dayjs';

// 테이블명
const modelName = 'Question';

// 컬럼 정의
const attributes = {
  id: {
    field: 'id',
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    comment: '질문 PK',
  },
  userId: {
    field: 'user_id',
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    comment: '유저PK'
  },
  title: {
    field: 'title',
    type: DataTypes.STRING(30),
    allowNull: false,
    comment: '제목'
  },
  comment: {
    field: 'comment',
    type: DataTypes.STRING(250),
    allowNull: false,
    comment: '내용'
  },
  qnaImg: {
    field: 'qna_img',
    type: DataTypes.STRING(250),
    allowNull: true,
    comment: '첨부 사진'
  },
  res: {
    field: 'res',
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: '답변'
  },
  status: {
    field: 'status',
    type: DataTypes.BOOLEAN,
    allowNull: false,
    comment: '첨부 사진',
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
  tableName: 'questions', // 실제 DB 테이블명
  timestamps: true,   // createdAt, updatedAt를 자동 관리
  paranoid: true,      // soft delete 설정 (deletedAt 자동 관리)
};

const User = {
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
    db.Question.belongsTo(db.User, { targetKey: 'id', foreignKey: 'user_id', as: 'question_user'});
  },
}

export default User;
