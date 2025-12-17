/**
 * @file databases/migrations/20251217-01-create-notices.js
 * @description notices migration file
 * 251217 v1.0.0 wook 초기 생성
 */

import { DataTypes } from 'sequelize';

// 테이블명
const tableName = 'notices';

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
  level: {
    field: 'level',
    type: DataTypes.BIGINT,
    allowNull: false,
    comment: '공지 레벨',
    defaultValue: 0
  },
  createdAt: {
    field: 'created_at',
    type: DataTypes.DATE,
    allowNull: true,
    comment: '작성일',
  },
  updatedAt: {
    field: 'updated_at',
    type: DataTypes.DATE,
    allowNull: true,
    comment: '수정일',
  },
  deletedAt: {
    field: 'deleted_at',
    type: DataTypes.DATE,
    allowNull: true,
    comment: '삭제일',
  },
};

// 옵션 설정
const options = {
  charset: 'utf8mb4', // 테이블 문자셋 설정(이모지 지원)
  collate: 'utf8mb4_bin', // 정렬 방식 설정(영어 대소문자 구분 정렬)
  engine: 'InnoDB', // 사용 엔진 설정
};

/** @type {import('sequelize-cli').Migration} */
export default {
  // 마이그레이션 실행 시 호출되는 메소드(스키마 생성, 수정)
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(tableName, attributes, options);
  },

  // 마이그레이션을 롤백 시 호출되는 메소드(스키마 제거, 수정)
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(tableName);
  }
};
